"""강좌용 데이터 불러오기 (허깅페이스 공개 데이터셋 기반)

    import mldata
    df = mldata.load('titanic')                  # pandas DataFrame
    X, y, classes = mldata.load_images('mnist')  # 이미지 배열 (N, 28, 28) uint8
    mldata.info()                                 # 사용할 수 있는 데이터 목록
    df = mldata.from_hub('scikit-learn/iris')     # 허깅페이스 Hub 에서 직접 (인터넷 필요)

브라우저 실습이 빠르도록 각 데이터셋에서 일부(수백~수천 개)를 뽑아 assets/data/ 에 넣어 두었습니다.
전체 데이터는 Colab 노트북에서 datasets 라이브러리의 load_dataset() 으로 사용합니다.
"""
import io
import os

try:
    import _webbridge  # 브라우저(Pyodide 워커)
except ImportError:
    _webbridge = None

_HERE = os.path.dirname(os.path.abspath(__file__))

DATASETS = {
    # 이름: (파일, 허깅페이스 저장소, 설명)
    'iris': ('iris.csv', 'scikit-learn/iris', '붓꽃 150송이 · 꽃받침/꽃잎 크기 4개 특성 · 품종 3종'),
    'titanic': ('titanic.csv', 'phihung/titanic', '타이타닉 승객 891명 · 생존 여부(Survived)'),
    'california_housing': ('california_housing.csv', 'gvlassis/california_housing', '캘리포니아 구역 4000곳 · 집값 중앙값(MedHouseVal, 10만 달러)'),
    'adult': ('adult.csv', 'scikit-learn/adult-census-income', '미국 인구조사 5000명 · 연소득 50K 초과 여부(income)'),
    'nsmc': ('nsmc.csv', 'Blpeng/nsmc', '네이버 영화 리뷰 6000개 · 긍정(1)/부정(0)'),
    'mnist': ('mnist.npz', 'ylecun/mnist', '손글씨 숫자 28×28 흑백 3000장 · 0~9'),
    'fashion_mnist': ('fashion_mnist.npz', 'zalando-datasets/fashion_mnist', '옷 · 신발 28×28 흑백 3000장 · 10종'),
    'cifar10': ('cifar10.npz', 'uoft-cs/cifar10', '컬러 사진 32×32 1000장 · 10종'),
    'beans': ('beans.npz', 'AI-Lab-Makerere/beans', '콩잎 사진 64×64 261장 · 각진잎반점병/녹병/건강 3종'),
}

_CACHE_DIR = 'data'


def info():
    """사용할 수 있는 데이터셋 목록을 출력한다"""
    print(f"{'이름':<20}{'허깅페이스 저장소':<34}설명")
    print('-' * 90)
    for name, (_, repo, desc) in DATASETS.items():
        print(f'{name:<20}{repo:<34}{desc}')


def _read_bytes(fname):
    """assets/data/<fname> 의 내용을 바이트로 (작업 폴더에 캐시)"""
    local = os.path.join(_CACHE_DIR, fname)
    if os.path.exists(local):
        with open(local, 'rb') as f:
            return f.read()
    if _webbridge is not None:
        data = _webbridge.fetch_bytes(_webbridge.base() + 'assets/data/' + fname)
        if data is None:
            raise FileNotFoundError(f'데이터 파일을 내려받지 못했습니다: {fname} (인터넷 연결을 확인하세요)')
        b = bytes(data.to_py()) if hasattr(data, 'to_py') else bytes(data)
        os.makedirs(_CACHE_DIR, exist_ok=True)
        with open(local, 'wb') as f:
            f.write(b)
        return b
    path = os.path.join(_HERE, '..', 'assets', 'data', fname)  # 검증 도구 (로컬 CPython)
    with open(path, 'rb') as f:
        return f.read()


def _check(name):
    if name not in DATASETS:
        raise ValueError(f"'{name}' 데이터셋은 없습니다. 사용할 수 있는 이름: {', '.join(DATASETS)}")
    return DATASETS[name]


def load(name):
    """표 형태 데이터셋을 pandas DataFrame 으로 불러온다"""
    import pandas as pd
    try:
        pd.set_option('future.infer_string', False)   # 문자열 열은 object 로 (pandas 2 와 같게)
    except Exception:
        pass
    fname, _, _ = _check(name)
    if not fname.endswith('.csv'):
        raise ValueError(f"'{name}' 은 이미지 데이터셋입니다. mldata.load_images('{name}') 을 쓰세요.")
    return pd.read_csv(io.BytesIO(_read_bytes(fname)))


def load_images(name):
    """이미지 데이터셋 → (X, y, classes)

    X: uint8 배열 (N, H, W) 흑백 또는 (N, H, W, 3) 컬러, y: 정수 레이블 (N,), classes: 클래스 이름 리스트
    """
    import numpy as np
    fname, _, _ = _check(name)
    if not fname.endswith('.npz'):
        raise ValueError(f"'{name}' 은 표 데이터셋입니다. mldata.load('{name}') 을 쓰세요.")
    with np.load(io.BytesIO(_read_bytes(fname)), allow_pickle=False) as z:
        return z['X'], z['y'], [str(c) for c in z['classes']]


def from_hub(repo, split='train', config=None, n=None):
    """허깅페이스 Hub 의 데이터셋(parquet 변환본)을 직접 내려받아 DataFrame 으로 (인터넷 필요)

    예: mldata.from_hub('scikit-learn/iris'), mldata.from_hub('stanfordnlp/imdb', split='test', n=500)
    이미지 열은 {'bytes': ...} 형태로 들어옵니다.
    """
    import json
    import pandas as pd
    meta_url = f'https://datasets-server.huggingface.co/parquet?dataset={repo}'
    meta = json.loads(_get(meta_url).decode('utf-8'))
    files = [f for f in meta.get('parquet_files', []) if f['split'] == split and (config is None or f['config'] == config)]
    if not files:
        raise ValueError(f'{repo} 에서 split={split!r} config={config!r} 인 parquet 파일을 찾지 못했습니다.')
    df = pd.read_parquet(io.BytesIO(_get(files[0]['url'])))
    return df.head(n) if n else df


def _get(url):
    if _webbridge is not None:
        data = _webbridge.fetch_bytes(url)
        if data is None:
            raise ConnectionError(f'내려받기 실패: {url}')
        return bytes(data.to_py()) if hasattr(data, 'to_py') else bytes(data)
    from urllib.request import urlopen
    with urlopen(url) as r:
        return r.read()

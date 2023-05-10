import logging
from logging.handlers import TimedRotatingFileHandler
import os

logger = logging.getLogger('util')

def makedirs(path: str):
    """지정 경로에 폴더 존재하는지 확인하고 없으면 폴더 생성

    Args:
        path (str): [description]
    """
    try:
        if not os.path.exists(path):
            try:
                original_umask = os.umask(0)
                os.makedirs(path, 0o777)
            finally:
                os.umask(original_umask)

    except OSError:
        logger.exception("Error: Failed to create the directory.")
        raise


def logger_init(output_folder_path):
    """
    로그 생성 함수

    Parameters
    ----------
    logger_name : str
        DESCRIPTION.

    Returns
    -------
    TYPE
        DESCRIPTION.

    """
    makedirs(f'{output_folder_path}/log')
    rfh = TimedRotatingFileHandler(
        filename=f'{output_folder_path}/log/log',
        when="midnight",
        interval=1,
        encoding='utf-8'
    )
    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s [%(name)s] [%(filename)s:%(lineno)d]\t%(message)s")

    # Create Handlers
    streamHandler = logging.StreamHandler()
    streamHandler.setLevel(logging.DEBUG)
    streamHandler.setFormatter(formatter)
    logging.basicConfig(
        level=logging.DEBUG,
        format='"%(asctime)s %(levelname)s [%(name)s] [%(filename)s:%(lineno)d]\t%(message)s"',
        handlers=[
            rfh,
            streamHandler
        ])
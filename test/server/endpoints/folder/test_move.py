from pathlib import Path

import pytest

from src.server import models

from ...fixtures import bytes1, folder1, folder2, name1, not_secure

# Action


def test_server_folder_move(client):
    client("/folder/create", path=folder1)
    client("/file/create", path=name1, bytes=bytes1, folder=folder1)
    client("/folder/move", path=folder1, toPath=folder2)
    assert client("/file/list").files == [
        models.File(path=folder2, type="folder"),
        models.File(path=str(Path(folder2) / name1), type="file"),
    ]


def test_server_folder_move_to_folder(client):
    path2 = str(Path(folder2) / folder1 / name1)
    client("/folder/create", path=folder1)
    client("/folder/create", path=folder2)
    client("/file/create", path=name1, bytes=bytes1, folder=folder1)
    path = client("/folder/move", path=folder1, toPath=folder2).path
    assert path == str(Path(folder2) / folder1)
    assert client("/file/read", path=path2).bytes == bytes1
    assert client("/file/list").files == [
        models.File(path=folder2, type="folder"),
        models.File(path=str(Path(folder2) / folder1), type="folder"),
        models.File(path=str(Path(folder2) / folder1 / name1), type="file"),
    ]


@pytest.mark.parametrize("path", not_secure)
def test_server_file_move_security(client, path):
    client("/folder/create", path=name1)
    with pytest.raises(Exception):
        client("/folder/move", path=path, toPath=folder1)
    with pytest.raises(Exception):
        client("/folder/move", path=name1, toPath=path)

from __future__ import annotations

from pathlib import Path
from typing import Optional

from frictionless.resources import TextResource

from .stores import Database, Filesystem, Metadata


class Project:
    public: Path
    private: Path
    filesystem: Filesystem
    metadata: Metadata
    database: Database

    def __init__(self, basepath: Optional[str] = None):
        # Ensure structure
        self.public = Path(basepath or "")
        self.private = self.public / ".frictionless"
        self.public.mkdir(parents=True, exist_ok=True)
        self.private.mkdir(parents=True, exist_ok=True)

        # Ensure gitignore
        text = "database.db"
        path = str(self.private / ".gitignore")
        resource = TextResource(data=text)
        resource.write_text(path=path)

        # Create drivers
        self.filesystem = Filesystem(self)
        self.metadata = Metadata(self)
        self.database = Database(self)
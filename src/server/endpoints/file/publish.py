from __future__ import annotations

from typing import Any, Dict

from fastapi import Request
from frictionless import Control, Package, Resource
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    # TODO: use IControl?
    control: Dict[str, Any]


class Result(BaseModel, extra="forbid"):
    url: str


@router.post("/file/publish")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    fs = project.filesystem

    record = helpers.read_record_or_raise(project, path=props.path)
    resource = Resource.from_descriptor(record.resource)
    package = Package(resources=[resource], basepath=str(fs.basepath))  # type: ignore
    url = package.publish(control=Control.from_descriptor(props.control))  # type: ignore

    return Result(url=url)  # type: ignore

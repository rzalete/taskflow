from pydantic import BaseModel, EmailStr

from app.models import Role


class MemberAdd(BaseModel):
    email: EmailStr
    role: Role = Role.member


class MemberRoleUpdate(BaseModel):
    role: Role


class MemberRead(BaseModel):
    user_id: int
    email: EmailStr
    full_name: str
    role: Role

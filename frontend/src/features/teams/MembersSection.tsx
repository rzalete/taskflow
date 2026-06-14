import { useState, type FormEvent } from "react"
import { isAxiosError } from "axios"

import { useAuth } from "../auth/auth-context"
import { type Role } from "./membersApi"
import {
  useAddMember,
  useMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "./useMembers"
import { useToast } from "../../components/toast/toast-context"

const ROLES: Role[] = ["member", "admin", "owner"]

function addErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const status = err.response?.status
    if (status === 404)
      return "No user with that email. They need an account first."
    if (status === 400) return "That person is already a member."
    if (status === 403) return "Only an owner can grant the owner role."
  }
  return "Something went wrong. Please try again."
}

export function MembersSection({ teamId }: { teamId: number }) {
  const { user } = useAuth()
  const membersQuery = useMembers(teamId)
  const addMember = useAddMember(teamId)
  const updateRole = useUpdateMemberRole(teamId)
  const removeMember = useRemoveMember(teamId)

  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("member")
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  const members = membersQuery.data ?? []
  const currentRole = members.find((m) => m.user_id === user?.id)?.role
  const canManage = currentRole === "owner" || currentRole === "admin"
  const toast = useToast()

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await addMember.mutateAsync({ email, role })
      setEmail("")
      setRole("member")
      toast.success("Member added")
    } catch (err) {
      toast.error(addErrorMessage(err))
    }
  }

  async function handleRoleChange(userId: number, nextRole: Role) {
    try {
      await updateRole.mutateAsync({ userId, role: nextRole })
      toast.success("Role updated")
    } catch (err) {
      toast.error(
        isAxiosError(err) && err.response?.status === 400
          ? "You can't demote the last owner."
          : "Couldn't change that member's role.",
      )
    }
  }

  async function handleRemove(userId: number) {
    try {
      await removeMember.mutateAsync(userId)
      toast.success("Member removed")
    } catch (err) {
      toast.error(
        isAxiosError(err) && err.response?.status === 400
          ? "You can't remove the last owner."
          : "Couldn't remove that member.",
      )
    } finally {
      setConfirmingId(null)
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-ink-faint text-sm font-semibold tracking-wide uppercase">
        Members
      </h2>

      {membersQuery.isPending && (
        <p className="text-ink-faint mt-2 text-sm">Loading…</p>
      )}
      {membersQuery.isError && (
        <p className="text-danger-strong mt-2 text-sm">
          Couldn't load members.
        </p>
      )}

      <ul className="mt-3 space-y-2">
        {members.map((member) => (
          <li
            key={member.user_id}
            className="rounded-card border-line bg-surface flex items-center justify-between gap-3 border p-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="text-ink truncate font-medium">
                {member.full_name}
              </p>
              <p className="text-ink-muted truncate text-sm">{member.email}</p>
            </div>

            <div className="flex items-center gap-2">
              {canManage ? (
                <select
                  aria-label={`Role for ${member.full_name}`}
                  value={member.role}
                  onChange={(event) =>
                    handleRoleChange(member.user_id, event.target.value as Role)
                  }
                  className="rounded-control border-line bg-surface text-ink focus:border-brand-500 focus:ring-brand-500/15 border px-2 py-1 text-sm capitalize focus:ring-2 focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-ink-muted text-sm capitalize">
                  {member.role}
                </span>
              )}

              {canManage &&
                (confirmingId === member.user_id ? (
                  <button
                    onClick={() => handleRemove(member.user_id)}
                    className="rounded-control bg-red-600 px-2 py-1 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmingId(member.user_id)}
                    className="rounded-control border-line text-ink-muted hover:bg-well hover:text-ink border px-2 py-1 text-sm font-medium"
                  >
                    Remove
                  </button>
                ))}
            </div>
          </li>
        ))}
      </ul>

      {canManage && (
        <form
          onSubmit={handleAdd}
          className="mt-4 flex flex-wrap items-start gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Add member by email"
            className="rounded-control border-line bg-surface text-ink placeholder:text-ink-faint focus:border-brand-500 focus:ring-brand-500/15 flex-1 border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          <select
            aria-label="Role for new member"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            className="rounded-control border-line bg-surface text-ink focus:border-brand-500 focus:ring-brand-500/15 border px-2 py-2 text-sm capitalize focus:ring-2 focus:outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={addMember.isPending}
            className="rounded-control bg-brand-600 shadow-brand hover:bg-brand-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Add member
          </button>
        </form>
      )}
    </section>
  )
}

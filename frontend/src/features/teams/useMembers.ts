import { useQuery } from "@tanstack/react-query"

import { getMembers } from "./membersApi"

export function useMembers(teamId: number) {
  return useQuery({
    queryKey: ["teams", teamId, "members"],
    queryFn: () => getMembers(teamId),
  })
}

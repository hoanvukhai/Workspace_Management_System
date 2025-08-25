import AddMember from "./AddMember";
import MemberList from "./MemberList";
import { useState } from "react";

function ManageMembers({ workspaceId, currentUserRole }) {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  return (
    <div>
      <AddMember workspaceId={workspaceId} onMemberAdded={triggerRefresh} currentUserRole={currentUserRole}/>
      <MemberList workspaceId={workspaceId} key={refresh} currentUserRole={currentUserRole}/>
    </div>
  );
}

export default ManageMembers;
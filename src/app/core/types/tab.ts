export type TabName = "members" | "manage";

export type Tab = {
  name: TabName;
  ownerOnly: boolean;
};

export const tabs: Record<TabName, Tab> = {
  members: {name: "members", ownerOnly: false},
  manage: {name: "manage", ownerOnly: true}
};

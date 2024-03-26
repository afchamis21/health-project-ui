export type TabName = "members" | "manage" | "schedule" | "supplies";

export type Tab = {
  name: TabName;
  displayText: string;
  ownerOnly: boolean;
};

export const tabs: Record<TabName, Tab> = {
  schedule: {name: 'schedule', displayText: 'horários', ownerOnly: false},
  members: {name: 'members', displayText: 'membros', ownerOnly: false},
  manage: {name: 'manage', displayText: 'gerenciar', ownerOnly: true},
  supplies: {name: 'supplies', displayText: 'suprimentos', ownerOnly: false}
};

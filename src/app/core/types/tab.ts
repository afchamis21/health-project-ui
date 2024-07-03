export type TabName = "members" | "manage" | "schedule" | "supplies" | "attendance";

export type Tab = {
  name: TabName;
  displayText: string;
  ownerOnly: boolean;
};

export const tabs: Record<TabName, Tab> = {
  schedule: {name: 'schedule', displayText: 'horários', ownerOnly: false},
  members: {name: 'members', displayText: 'colaboradores', ownerOnly: true},
  manage: {name: 'manage', displayText: 'gerenciar', ownerOnly: true},
  supplies: {name: 'supplies', displayText: 'suprimentos', ownerOnly: false},
  attendance: {name: 'attendance', displayText: 'histórico de presença', ownerOnly: true},
};

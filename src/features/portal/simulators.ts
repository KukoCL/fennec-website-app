// Presentation catalog only: navigationKey is NOT a telemetry simulatorId or an authorization scope.
// Add entries only when their real backend identity, partition and permissions have been implemented.
export const simulatorCatalog = [
  { navigationKey: 'jumbo', name: 'Jumbo', routeName: 'jumbo-telemetry' },
] as const

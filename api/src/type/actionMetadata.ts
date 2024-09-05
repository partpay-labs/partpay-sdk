export interface ActionMetadata {
    title: string,
    description: string,
    icon: string,
    label: string,
    pubkey: string,
    financingOptions: FinancingOption[];
}

export interface FinancingOption {
    term: number;
    termUnit: 'days' | 'weeks' | 'months';
    interestRate: number;
    minimumDownPayment: bigint;
}

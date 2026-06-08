export interface SelectOption {
    value: string;
    label: string;
    description?: string;
}

export const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const timeOptions: SelectOption[] = [
    { value: 'morning', label: 'Morning', description: '9:00 AM - 12:00 PM' },
    { value: 'afternoon', label: 'Afternoon', description: '12:00 PM - 4:00 PM' },
    { value: 'evening', label: 'Late Afternoon', description: '4:00 PM - 6:00 PM' }
];

export const powerNeedOptions: SelectOption[] = [
    { value: 'light', label: 'Light Usage', description: 'Fans, TV, Laptops, Lighting' },
    { value: 'medium', label: 'Medium Usage', description: 'Standard loads + 1 AC or Pumping Machine' },
    { value: 'heavy', label: 'Heavy Usage', description: 'Multiple ACs, Heavy appliances' },
    { value: 'unsure', label: 'Unsure / Need Assessment', description: 'Our engineers will calculate for you' }
];

import API from './axios';

export interface Address {
    _id: string;
    street: string;
    city: string;
    state: string;
    phone: string;
    isDefault?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddressPayload {
    street: string;
    city: string;
    state: string;
    phone: string;
    isDefault?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export const addressApi = {
    // Fetch all addresses for the authenticated user
    getAddresses: async (): Promise<Address[]> => {
        try {
            const response = await API.get<ApiResponse<Address[]> | { addresses: Address[] }>('/users/addresses');
            const resData = response.data;

            if ('data' in resData && resData.data) {
                return resData.data;
            }
            
            return (resData as { addresses: Address[] }).addresses || [];
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw error;
        }
    },

    // Add a new address
    addAddress: async (addressData: AddressPayload): Promise<Address> => {
        try {
            const response = await API.post<ApiResponse<Address> | { address: Address }>('/users/addresses', addressData);
            const resData = response.data;
            if ('data' in resData && resData.data) {
                return resData.data;
            }
            return (resData as { address: Address }).address;
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    },

    // Update an existing address
    updateAddress: async (addressId: string, addressData: AddressPayload): Promise<Address> => {
        try {
            const response = await API.put<ApiResponse<Address> | { address: Address }>(`/users/addresses/${addressId}`, addressData);
            const resData = response.data;
            if ('data' in resData && resData.data) {
                return resData.data;
            }
            return (resData as { address: Address }).address;
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    // Delete an address by ID
    deleteAddress: async (addressId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await API.delete<ApiResponse<null>>(`/users/addresses/${addressId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    },

    // Mark an address as default
    setDefaultAddress: async (addressId: string): Promise<Address> => {
        try {
            const response = await API.put<ApiResponse<Address> | { address: Address }>(`/users/addresses/${addressId}/default`);
            const resData = response.data;
            if ('data' in resData && resData.data) {
                return resData.data;
            }
            return (resData as { address: Address }).address;
        } catch (error) {
            console.error('Error setting default address:', error);
            throw error;
        }
    }
};
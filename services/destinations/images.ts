import { API_URL } from '../api';


interface Destination {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
   
    rating: number;
    type: string;
  }

  const isValidDestination = (item: any): item is Destination => {
    return (
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.description === 'string' &&
      typeof item.imageUrl === 'string' &&
      
      typeof item.rating === 'number'
    );
  };
  
  export const fetchDestinations = async (type: string): Promise<Destination[]> => {
    try {
      const response = await fetch(`${API_URL}/destinations/${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch destinations: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data) || !data.every(isValidDestination)) {
        throw new Error('Invalid data format received from API');
      }
      return data;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  };
  
import axios from 'axios';


export const getCurrentTime = async (): Promise<string> => {

    try {

        const response = await axios.get('https://worldtimeapi.org/api/ip');
        const { datetime } = response.data;
        return `Current time: ${datetime}`;
    } catch (e) {
        console.error('Error fetching current time.',e);
        return 'Error fetching current time';
    }

}
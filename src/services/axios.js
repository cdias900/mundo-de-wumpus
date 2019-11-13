import axios from 'axios';

export default axios.create({
    baseURL: "https://mundo-de-wumpus.firebaseio.com/"
})
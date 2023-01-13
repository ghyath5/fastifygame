import { getRandomItem } from "../utils"

const CONSTANT = {
    red: 'الأحمر',
    blue: 'الأزرق',
    black: 'الأسود',
    white: 'الأبيض',
    green: 'الأخضر',
    yellow: 'الأصفر',
}
export const useColorify = () => {

    getRandomColors = () => {
        return [getRandomItem(Object.entries(CONSTANT)), getRandomItem(Object.entries(CONSTANT)), getRandomItem(Object.entries(CONSTANT))]
    }
    return {
        getRandomColors
    }
}
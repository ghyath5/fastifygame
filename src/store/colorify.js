import { reactive, ref } from "vue"
import { getRandomItem, shuffleArray } from "../utils"
import CryptoJS from 'crypto-js';
import axios from "axios";
let nextAudio = new Audio();
let loseAudio = new Audio();
(async () => {
    const nextAudioFile = await import('@/assets/correct-choice.mp3')
    const loseAudioFile = await import('@/assets/negative_beeps.mp3')
    nextAudio = new Audio(nextAudioFile.default)
    loseAudio = new Audio(loseAudioFile.default)
})();
export const COLORS = [
    {
        color: '#FF3D32',
        ar: 'الأحمر'
    },
    {
        color: '#3366FF',
        ar: 'الأزرق'
    },
    {
        color: '#01081D',
        ar: 'الأسود'
    }
]

const paragraphs = ['عليك الهدوء والتركيز واختيار', "قم بتحديد", "اختار", "حدد", "بسرعة اضغط على"]
export const isText = ref(false)
export const theColorToSelect = ref('')
export const paragraph = ref('')
export const token = ref('')
export let theColors = reactive([])
export const isTextOrColor = () => {
    isText.value = getRandomItem(['text', 'color']) == 'text'
}
export const fetchTheColors = () => {
    let colorsObjects = shuffleArray(COLORS)
    var i = 0;
    let names = ([...colorsObjects]).sort((a, b) => {
        let colorName = colorsObjects[i].ar
        if (i == 1) return -1;
        i++;
        return colorName == a.ar ? 1 : 0
    }).map((c) => c.ar)
    const colors = colorsObjects.map((c, i) => {
        return {
            name: names[i],
            color: c.color,
            correctName: c.ar //or en in future
        }
    })
    theColors = reactive(colors)
}

export const fetchColorToSelect = () => {
    theColorToSelect.value = getRandomItem(COLORS).ar
}


const randomParagraph = () => {
    paragraph.value = getRandomItem(paragraphs)
}
export const score = ref(0);
export const time = ref(10)
export const timer = ref(time.value)
export const timeToStart = ref(3)
export const popup = ref(false)


let intervalTimer = null

const finish = async () => {
    loseAudio.currentTime = 0;
    loseAudio.play()
    popup.value = true
    if (score.value <= 0) return;
    try {
        const datatosend = CryptoJS.AES.encrypt(JSON.stringify({ score: score.value, }), "RqkseWFamqxjLvWaLb9dj8qq59TqKghAqx5VQh6bjZKIUh2PFw6NfGUdgAhN4TRR");
        await axios.post(`https://tel-games.herokuapp.com/set?token=${token.value}`, { score: score.value, datatosend: datatosend.toString() })
    } catch (e) {
        console.log(e);
    }
}

const next = () => {
    nextAudio.currentTime = 0;
    nextAudio.play()
    if (score.value == 5) {
        time.value = 8
    } else if (score.value == 10) {
        time.value = 6
    } else if (score.value == 18) {
        time.value = 4
    } else if (score.value >= 25) {
        time.value = 3
    }
    timer.value = time.value;
    fetchColorToSelect()
    fetchTheColors()
    isTextOrColor()
    randomParagraph()
}
export const validateAnswer = (optionSelected) => {
    if (isText.value && optionSelected.text == theColorToSelect.value) {
        score.value++
        return next()
    }
    if (!isText.value && optionSelected.color == theColorToSelect.value) {
        score.value++
        return next();
    }
    clearInterval(intervalTimer)
    return finish();
}
export const startTimer = () => {
    intervalTimer = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
            clearInterval(intervalTimer)
            intervalTimer = null;
            timer.value = time.value;
            return finish()
        }
    }, 1000)
}
const startTheGame = () => {
    score.value = 0;
    time.value = 10;
    timer.value = time.value
    startTimer()
}

export const initialize = () => {
    timeToStart.value = 3
    popup.value = false;
    fetchColorToSelect()
    fetchTheColors()
    randomParagraph()
    isTextOrColor()
    clearInterval(intervalTimer)
    let myintervalStart = setInterval(() => {
        timeToStart.value--;
        if (timeToStart.value <= 0) {
            clearInterval(myintervalStart)
            startTheGame()
            myintervalStart = null
        }
    }, 1000)
}
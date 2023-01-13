import { useVibrate } from "@vueuse/core"
import axios from "axios"
import { computed, ref, watch, reactive } from "vue"
import { useRoute } from "vue-router"
import { activeWordIndex, input, lastScore, time, TIME_LIMIT, words } from "../store/fastify"
import CryptoJS from 'crypto-js';
// import clockFile from '../assets/clock.wav'
const w1 = 'سمعت ذات مرة رجل يتحدث عن معاناة القوم الذين كانوا يعانون من المعاناة الدائمة'
const w2 = "يقول الشاعر العربي الفصيح انما نحن قوم لم نكن اقوام من قبل كما كنا اليوم مع هذا"
const w3 = "اسمع يا من تسمع واكتب يا من تكتب هذه الحروف ليست للكتابة وانما للذين كانوا قبلك في هذا اليوم"
const w4 = 'هل تعلم معنى انك قد كنت في يوم من الايام لا تعلم ما معنى ما كنت تعلم من قبل'
const w5 = 'اليوم انت حي وغدا تحت التراب يعني لا تفكر حالك رح تخلد بهالدنيا ياروحي مرجوعك الى ربك'
const w6 = 'تذكر دائما انه هناك دائما كما تتذكر في وقت ما تتذكر من المتذكرين في الدنيا ولا تكن من هؤلاء الذين لم يكن لديهم مفكرة او روزناما'
const w7 = "ليك عقلك براسك بتعرف خلاصك"
const w8 = "هناك رجل عربي يدعى كرايسو كلومنتاس ولكن اسمه اجنباوي لا يقول ولا يفعل شيء وهو من عامة الشعب وانما لأجعلك تكتب اسمه الصعب لكي لا تحصل على مستوى عال في الكتابة"

const randomize = () => {
    words.splice(0);
    [
        w1.split(' '),
        w2.split(' '),
        w3.split(' '),
        w4.split(' '),
        w5.split(' '),
        w6.split(' '),
        w7.split(' '),
        w8.split(' '),
    ].sort(() => 0.5 - Math.random()).forEach((arr) => words.push(...arr))
}
randomize()

var bell = new Audio();
(async () => {
    let bellFile = await import('../assets/BELL.wav');
    bell = new Audio(bellFile.default)
    bell.preload = true;
})();
export function useFastify() {
    const inputRef = ref()
    const route = useRoute()
    if (!route.query?.token) {
        return window.location.href = 'https://t.me/Ghyath_Darwish'
    };
    const direction = ref('rtl')
    const activeWordIndexPresisit = activeWordIndex
    const inputPresist = input
    const activeWord = computed(() => words[activeWordIndex.value])
    const validateObject = computed(() => {
        return {
            stillValid: activeWord.value.startsWith(inputPresist.value),
            canContinue: activeWord.value == inputPresist.value,
        }
    })
    const { vibrate, isSupported, stop } = useVibrate({ pattern: [100, 50, 100] })
    const score = computed(() => {
        let sc = words.reduce((prev, currentWord, index) => {
            if (activeWordIndexPresisit.value > index) return prev + currentWord.length;
            return prev
        }, 0)
        return sc
    })
    watch([inputPresist, validateObject], (value, oldValue) => {
        if (validateObject.value.canContinue) {
            // score.value += activeWord.value.length
            inputPresist.value = ''
            activeWordIndexPresisit.value++
        }
        if (
            !validateObject.value.stillValid
            &&
            value[0].length >= oldValue[0].length &&
            isSupported
        ) {
            vibrate()
        }
    })
    // watch(time, (ti) => {
    //     if (ti <= 4) {
    //         clock.play()
    //     } else {
    //         clock.pause()
    //         clock.currentTime = 0
    //     }
    // })
    const hhmmTime = computed(() => new Date(time.value * 1000).toISOString().slice(14, 19))

    const done = async () => {
        try {
            const datatosend = CryptoJS.AES.encrypt(JSON.stringify({ score: score.value, }), "RqkseWFamqxjLvWaLb9dj8qq59TqKghAqx5VQh6bjZKIUh2PFw6NfGUdgAhN4TRR");
            await axios.post(`https://tel-games.herokuapp.com/set?token=${route.query.token}`, { score: score.value, datatosend: datatosend.toString() })
        } catch (e) {
            console.log(e);
        }
        endTime()
    }

    let interval = ref(null);
    const endTime = () => {
        randomize()
        time.value = TIME_LIMIT
        activeWordIndexPresisit.value = 0;
        inputPresist.value = '';
    }
    const startTime = () => {
        // endTime()
        interval.value = setInterval(() => {
            time.value--;
            if (time.value <= 0) {
                done();
                inputRef.value.blur()
                clearInterval(interval.value)
                input.value = '';
                interval.value = null
                bell.play()
                return
            }
        }, 1000);
    }
    return {
        words,
        input: inputPresist,
        activeWordIndex: activeWordIndexPresisit,
        activeWord,
        validateObject,
        direction,
        time,
        score,
        hhmmTime,
        startTime,
        endTime,
        interval,
        inputRef
    }
}
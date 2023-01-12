import { useVibrate } from "@vueuse/core"
import { computed, ref, watch, reactive } from "vue"
import { useRoute } from "vue-router"
import { activeWordIndex, input, lastScore, time, TIME_LIMIT, words } from "../store/fastify"
// import clockFile from '../assets/clock.wav'
const w1 = 'خشمي مثل خشمك ولكن خشمك ليس هو انفك فلا تحشر انفك بالاماكن التي لا ينحشر فيها المناخير يا عزيزي'
const w2 = 'اذا نظرت في عينك ترى مالم تراه في اذنك وهذا دليل علمي اكيد على ان الاشخاص ترى الاشياء باستخدام العيون كما حال اغلب شعبنا اليوم'
const w3 = 'ان كنت مضطر ان تسمع ماليس لك به علم فكن من المستمعين للقول المتبعين احسنه'
const w4 = 'جالس على مؤخرتك اليوم كما البارح لاحيلتك ولا فتيلتك ايد من الخلف وايد من الامام مثل صبي الحمام'
const w5 = 'اليوم انت حي وغدا تحت التراب يعني لا تفكر حالك رح تخلد بهالدنيا ياروحي مرجوعك الى ربك'
const w6 = 'تذكر دائما انه هناك دائما كما تتذكر في وقت ماتتذكر من المتذكرين في الدنيا ولا تكن من هؤلاء الذين لم يكن لديهم مفكرة او روزناما'
const w7 = "ليك عقلك براسك بتعرف خلاصك"

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
    ].sort(() => 0.5 - Math.random()).forEach((arr) => words.push(...arr))
}
randomize()
let bellFile = await import('../assets/BELL.wav');
var bell = new Audio(bellFile.default)
bell.preload = true;
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
    watch(score, (n, oldVal) => {
        lastScore.value = oldVal;
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
            await fetch(`http://localhost:8080/set?token=${route.query.token}&s=${score.value}`, {
                method: 'POST'
            });
        } catch (e) {
            console.log(e);
        }
    }

    let interval = ref(null);
    const endTime = () => {
        randomize()
        clearInterval(interval)
        time.value = TIME_LIMIT
        activeWordIndexPresisit.value = 0;
        inputPresist.value = '';
    }
    const startTime = () => {
        // endTime()
        interval.value = setInterval(async () => {
            time.value--;
            if (time.value <= 0) {
                inputRef.value.blur()
                clearInterval(interval.value)
                interval.value = null
                input.value = '';
                bell.play()
                await done();
                return endTime()
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
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DELAY = 1000;
const refs = {
    input: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
}
let selectedDate = null;

refs.startBtn.disabled = true;
refs.startBtn.addEventListener('click', onStartBtnClick);

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        selectedDate = selectedDates[0];
        if (selectedDate < new Date()) {
            return Notify.failure("Please choose a date in the future");        
        }
        refs.startBtn.disabled = false;
    },
};

flatpickr(refs.input, options);

function onStartBtnClick() {
    refs.input.disabled = true;
    refs.startBtn.disabled = true;
    const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = selectedDate.getTime() - currentTime;
        const time = convertMs(deltaTime);
        updateTime(time);
        if (deltaTime < DELAY) {
            clearInterval(intervalId);
            return Notify.success("Time's up");
        }
    }, DELAY);    
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTime({ days, hours, minutes, seconds }) {
    refs.days.textContent = days;
    refs.hours.textContent = hours;
    refs.minutes.textContent = minutes;
    refs.seconds.textContent = seconds;
}

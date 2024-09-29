import events from '../../events.js';

const months = {
    ru: {
        1: 'Января',
        2: 'Февраля',
        3: 'Марта',
        4: 'Апреля',
        5: 'Мая',
        6: 'Июня',
        7: 'Июля',
        8: 'Августа',
        9: 'Сентября',
        10: 'Октября',
        11: 'Ноября',
        12: 'Декабря',
    },
    en: {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'September',
        9: 'January',
        10: 'October',
        11: 'November',
        12: 'December',
    }
};

const phrases = {
    ru: {
        today: 'Сегодня',
        soon: 'Скоро',
        completed: 'Завершено',
        empty: 'Cобытий нет',
        limits: 'Лимиты стадии:',
    },
    en: {
        today: 'Today',
        soon: 'Soon',
        completed: 'Сompleted',
        empty: 'No events',
        limits: 'Stage limits:',
    }
};

const currentDate = new Date();
const currentMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
let prevMonthDays;
if(currentDate.getMonth() == 0)
    prevMonthDays = new Date(currentDate.getFullYear() - 1, 12, 0);
else
    prevMonthDays = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth(), 0));
let nextMonthDays;
if(currentDate.getMonth() == 11)
    nextMonthDays = new Date(currentDate.getFullYear() + 1, 1, 0);
else
    nextMonthDays = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0));

function initDay(container, day, month, year) {
    const strDate = (day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month) + '.' + year;
    const item = document.createElement('div');
    const lang = document.querySelector('html').getAttribute('lang') ?? 'en';
    item.classList.add('swiper-slide', 'update__item');
    item.setAttribute('data-date', strDate);
    container.appendChild(item);
    
    const fulldate = document.createElement('div');
    fulldate.classList.add('update__item-fulldate');

    const fulldateToday = document.createElement('div');
    fulldateToday.classList.add('update__item-fulldate-today');
    fulldate.appendChild(fulldateToday);
    item.appendChild(fulldate);

    let event = events[strDate];

    let isSetDescription = false;

    if(day == currentDate.getDate() && month == currentDate.getMonth() + 1 && year == currentDate.getFullYear()) {
        item.classList.add('today');
        fulldateToday.innerText = phrases[lang]['today'];
    } else if(event) {
        const eventDate = new Date(year, month, day);
        const currentEventDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        if(eventDate.getTime() < currentEventDate.getTime())
            fulldateToday.innerText = phrases[lang]['completed'];
        else
            fulldateToday.innerText = phrases[lang]['soon'];
    }

    const textDate = document.createElement('div');
    textDate.classList.add('update__item-fulldate-date');
    textDate.innerText = day + ' ' + months[lang][month] + ' ' + year;
    fulldate.appendChild(textDate);

    const date = document.createElement('div');
    date.classList.add('update__item-date');
    date.innerText = (day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month);
    item.appendChild(date);

    if(!event) {
        const title = document.createElement('div');
        title.classList.add('update__item-name');
        title.innerText = phrases[lang]['empty'];
        item.appendChild(title);
        return;
    }

    item.classList.add('event');

    const title = document.createElement('div');
    title.classList.add('update__item-name');
    title.innerText = event[lang]['title'];
    item.appendChild(title);

    let limitsItems = ``;

    if(event.limits && event.limits.length > 0){
        limitsItems = '<div class="tooltip-update__limits"><div class="tooltip-update__limits-title">'+phrases[lang]['limits']+'</div><div class="tooltip-update__limits-list">';
        event.limits.forEach(element => {
            limitsItems += '<div class="tooltip-update__limits-item">';
            element.forEach((src, index) => {
                limitsItems += '<img src="'+src+'" alt="" class="tooltip-update__limits-item-panel-'+(index+1)+'">';
            });
            limitsItems += '</div>';
        });
        limitsItems += '</div></div>';
    }

    let tooltipTemplate = `
        <div class="tooltip-update">
            <div class="tooltip-update__header">
                <div class="tooltip-update__header-name">`+event[lang]['title']+`</div>
                <div class="tooltip-update__header-date">`+day+` `+months[lang][month]+` `+year+`</div>
            </div>
            <div class="tooltip-update__description">
                `+event[lang]['description']+`
            </div>
            `+limitsItems+`
        </div>
    `;

    tippy(item, {
        theme: 'tooltip-update',
        content: tooltipTemplate,
        allowHTML: true,
        distance: 30,
    });
}

document.querySelectorAll('.update__slider .swiper-wrapper').forEach(container => {

    for(let day = 1; day <= prevMonthDays.getDate(); day++) {
        initDay(container, day, prevMonthDays.getMonth() + 1, prevMonthDays.getFullYear());
    }
    for(let day = 1; day <= currentMonthDays.getDate(); day++) {
        initDay(container, day, currentMonthDays.getMonth() + 1, currentMonthDays.getFullYear());
    }
    for(let day = 1; day <= nextMonthDays.getDate(); day++) {
        initDay(container, day, nextMonthDays.getMonth() + 1, nextMonthDays.getFullYear());
    }

    container.querySelectorAll('.update__item').forEach((item, index) => {
        item.setAttribute('data-index', index);
    });
});

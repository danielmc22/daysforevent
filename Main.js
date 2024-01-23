let events = []; //let ya que se va a modificar luego
let arr = []; //para cargar info de localStorage

const eventName = document.querySelector('#eventName');
const eventDate = document.querySelector('#eventDate');
const buttonAdd  = document.querySelector('#bAdd');
const eventsContainer = document.querySelector('#eventsContainer');

const json = load();

try {
  arr = JSON.parse(json);    //Convierte un JSON strin -> objeto
} catch (error) {
  arr = [];
}
events = arr ? [...arr] : [];

renderEvents();



document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  addEvent();
});

buttonAdd.addEventListener('click', (e) => {
  e.preventDefault();
  addEvent();
});

function addEvent() {
  if (eventName.value == '' || eventDate.value == ''){
    return;
  }
  if (dateDiff(eventDate.value) < 0) {  //valida si se ingresó una fecha pasada... #s negativos
    return;
  }

  const newEvent = {
    id: (Math.random() * 100).toString(36).slice(3),
    name: eventName.value,
    date: eventDate.value,
    daysToEvent: dateDiff()
  };

  events.unshift(newEvent); //add elements at start of the array
  save(JSON.stringify(events));

  eventName.value = '';
  renderEvents();
};

function dateDiff(d) {
  const targetDate = new Date(d);
  const today = new Date();
  const difference = targetDate.getTime() - today.getTime();
  const days = Math.ceil(difference / (1000 * 3600 * 24)); //redondea hacia el siguiente #
  return days;
};

function renderEvents(){
  const eventsHTML = events.map(event => {
    return `
      <div class="event">
          <div class="days">
              <span class="days-number">${dateDiff(event.date)}</span>
              <span class="days-text">Days</span>
          </div>

          <div class="event-name">${event.name}</div>
          <div class="event-date">${event.date}</div>
          <div class="actions" >
              <button class="Bdelete" data-id="${event.id}">Delete</button>
          </div>
      </div>
    `;
  });

  eventsContainer.innerHTML = eventsHTML.join("");

  document.querySelectorAll(".Bdelete").forEach(button => {  //se seleccionan todos los botones de delete. y para c/u se le agrega un addEve
    button.addEventListener('click', e => {
      const id = button.getAttribute('data-id');            // sacamos el id del evento
      events = events.filter(event => event.id != id);      //se filtra los eventos que tengan un id dif al que se presiono y se elimina el del id.

      renderEvents();
    })
  });
};

function save(data) {
    localStorage.setItem('items', data);  // 1° atrib: nombre - 2° atrib: valor
};

function load() {
  return localStorage.getItem('items');  //devuelve la info seteada anteriormente
};
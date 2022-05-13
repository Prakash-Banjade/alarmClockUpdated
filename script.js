  // Creating the live clock
  let timeContainer = document.getElementById('clock');
  let dayAndDate = document.getElementById('dayAndDate');
  let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let alarmTone = new Audio('https://d6cp9b00-a.akamaihd.net/downloads/ringtones/files/mp3/twirling-intime-lenovo-k8-note-alarm-tone-41440.mp3');
  Time();
  showAlarms();
  let dddd = new Date();
  //   console.log(typeof dddd.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }))

  function Time() {
      let date = new Date();
      timeContainer.innerText = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
      dayAndDate.innerText = date.toDateString();


      setTimeout(() => {
          Time();
      }, 1000);
  }

  //   Adding js on modal
  let date = new Date();

  //   Settingup hours
  let hours = document.getElementById('hours');
  let formattedHour = date.getHours();

  if (formattedHour > 12) {
      hours.value = formattedHour - 12;
  } else {
      hours.value = formattedHour;
  }

  hours.addEventListener('input', (e) => {
      if (hours.value.length != 2) {
          let strNum = String(hours.value);
          let formattedHour = strNum.slice(0, 2);
          hours.value = Number(formattedHour);
      }
      if (hours.value > 12 || hours.value < 0) {
          hours.value = 12;
      }
  })

  hours.addEventListener('blur', () => {
          if (hours.value < 1) {
              hours.value = 12;
          }
          if (hours.value.charAt(0) == 0 && hours.value.length == 2 && hours.value != 00) {
              hours.value = hours.value.charAt(1);
          }
      })
      //   Setting up minutes
  let minutes = document.getElementById('minutes');
  minutes.value = date.getMinutes();
  minutes.addEventListener('input', (e) => {
      if (minutes.value.length != 2) {
          let strNum = String(minutes.value);
          let formattedMin = strNum.slice(0, 2);
          minutes.value = Number(formattedMin);
      }

      if (minutes.value > 59 || minutes.value < 0) {
          minutes.value = 00;
      }
  })

  minutes.addEventListener('blur', () => {
      if (minutes.value.length === 1) {
          minutes.value = '0' + minutes.value;
      }
      if (minutes.value < 1) {
          minutes.value = 00;
      }
  })


  //   setting up days
  let Days = [];
  let days = document.getElementsByClassName('day');
  for (item of days) {
      item.addEventListener('input', (e) => {
          if (e.target.checked) {
              Days.push(e.target.id);
          } else {
              if (Days.indexOf(e.target.id) != -1) {
                  Days.splice(Days.indexOf(e.target.id), 1);
              }

          }
      })
  }






  // setting up periods
  let periods = document.getElementById('periods');
  //   console.log(periods.value)


  //   opening the Modal onclick

  let addAlarmBtn = document.getElementById('addAlarm');
  addAlarmBtn.addEventListener('click', (e) => {
      document.getElementById('modalContainer').style.display = 'flex';
  })


  // When clicked on done btn


  let done = document.getElementById('done');

  done.addEventListener('click', (e) => { addAlarm(e) });
  document.getElementById('addAlarmModal').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          addAlarm(e);
      }
  })

  function addAlarm(event) {
      let alarms = localStorage.getItem('alarms');
      let myAlarms;

      if (alarms == null) {
          myAlarms = [];
      } else {
          myAlarms = JSON.parse(localStorage.getItem('alarms'))
      }

      let myAlarmObj = {
          HOUR: hours.value,
          MINUTE: minutes.value,
          PERIOD: periods.value,
          DAYS: Days,
          TITLE: document.getElementById('alarmName').value,
          TOGGLE: true
      }

      myAlarms.push(myAlarmObj);
      localStorage.setItem('alarms', JSON.stringify(myAlarms))
      document.getElementById('modalContainer').style.display = 'none';
      showAlarms();
      let addAlarm = document.getElementById('addAlarm');
      addAlarm.classList.add('alarmSet');
      addAlarm.children[0].classList.replace('fa-plus', 'fa-check');

      setTimeout(() => {
          addAlarm.classList.remove('alarmSet');
          addAlarm.children[0].classList.replace('fa-check', 'fa-plus');
      }, 3000);
  }

  //   showing the alarms
  var toggleBtns;

  function showAlarms() {

      let alarms = localStorage.getItem('alarms');
      let myAlarms;

      if (alarms == null) {
          myAlarms = [];
      } else {
          myAlarms = JSON.parse(localStorage.getItem('alarms'))
      }



      let html = "";
      myAlarms.forEach(function(element, index) {
          let alarmDays = ``;
          let date = new Date();

          element.DAYS.forEach(function(item) {
              if (item == weekDays[date.getDay()]) {

                  alarmDays += `<span style="color: green;">${item}</span> `
              } else {
                  alarmDays += `<span>${item}</span> `;
              }
          })



          if (element.TOGGLE) {

              html += ` <div class="alarm">
            <h1>${element.HOUR}:${element.MINUTE} ${element.PERIOD} <strong>${element.TITLE}</strong> </h1>
            <p>${alarmDays}</p>
            <div class="toggleAlarmParent">
            <div class="toggleAlarm alarmOn" id="toggleAlarm" title="Turn off alarm">            
            </div>
            </div>
            <i class="fas fa-times" id="${index}" title="Delete Alarm" onclick="delAlarm(this.id)"></i>
            </div>`;
          } else {
              html += ` <div class="alarm">
              <h1 class="alarmOff">${element.HOUR}:${element.MINUTE} ${element.PERIOD} <strong>${element.TITLE}</strong></h1>
              <p class="alarmOff">${alarmDays}</p>
              <div class="toggleAlarmParent">
              <div class="toggleAlarm " id="toggleAlarm" title="Turn on alarm">
              
              
              </div>
              </div>
              <i class="fas fa-times" id="${index}" title="Delete Alarm" onclick="delAlarm(this.id)"></i>
              </div>`;
          }
      })

      if (myAlarms.length != 0) {
          document.getElementById('alarmContainer').innerHTML = html;

      } else {
          document.getElementById('alarmContainer').innerHTML = `<p style="font-family: var(--primary-font); color:dodgerblue; text-align: center;">No alarms set yet !</p>`;
      }
      toggleBtns = document.querySelectorAll('.toggleAlarm');
      ToggleAlarm();
  }

  //   Deleting the alarm when click on cross

  function delAlarm(alarmInd) {
      let myAlarms = JSON.parse(localStorage.getItem('alarms'));
      myAlarms.splice(alarmInd, 1);
      localStorage.setItem('alarms', JSON.stringify(myAlarms));
      showAlarms();
  }

  //   canceling the alarm
  let cancelAlarmBtn = document.getElementById('cancel');
  cancelAlarmBtn.addEventListener('click', () => {
      document.getElementById('modalContainer').style.display = 'none';
  })

  // Toggling the alarm on or off
  function ToggleAlarm() {
      let myAlarms = JSON.parse(localStorage.getItem('alarms'));
      toggleBtns.forEach(function(toggle) {
          toggle.addEventListener('click', (e) => {
              if (myAlarms[toggle.parentNode.parentNode.children[3].id].TOGGLE) {
                  myAlarms[toggle.parentNode.parentNode.children[3].id].TOGGLE = false;
                  localStorage.setItem('alarms', JSON.stringify(myAlarms));
                  showAlarms();
              } else {
                  myAlarms[toggle.parentNode.parentNode.children[3].id].TOGGLE = true;
                  localStorage.setItem('alarms', JSON.stringify(myAlarms));
                  showAlarms();
              }
          })
      })
  }

  //   Checking the Alarm to ring or not || Performing the actual work
  let x;
  checkingAlarm();

  function checkingAlarm() {

      x = setInterval(() => {

          checkAlarm();
      }, 1000);
  }


  function checkAlarm() {
      let alarms = localStorage.getItem('alarms');
      let myAlarms;

      if (alarms == null) {
          myAlarms = [];
      } else {
          myAlarms = JSON.parse(localStorage.getItem('alarms'))
      }
      let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let date = new Date();
      let currTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
      let todayDay = weekDays[date.getDay()];
      myAlarms.forEach((element, index) => {
          let checkHour;
          if (date.getHours() > 12) {
              checkHour = date.getHours() - 12;
          }


          //   Alarm set without any weekdays
          if (element.DAYS.length == 0) {
              if (element.HOUR == checkHour && element.MINUTE == date.getMinutes() && currTime.includes(element.PERIOD) && date.getSeconds() == 0 && element.TOGGLE == true) {
                  //   console.log('Alarm rang' + ' ' + alarmTime + ' ' + alarmPeriod + ' ' + 'No weekdays set');
                  alarmTone.addEventListener('ended', function() {
                      this.currentTime = 0;
                      this.play();
                  }, false);
                  alarmTone.play();
                  let palet = document.getElementById('alarmRingingPalet');
                  palet.style.display = 'flex';
                  palet.children[0].innerText = element.HOUR + ':' + element.MINUTE + ' ' + element.PERIOD;
                  palet.children[1].innerText = element.TITLE;
                  myAlarms[index].TOGGLE = false;
                  localStorage.setItem('alarms', JSON.stringify(myAlarms));
                  showAlarms();


                  clearInterval(x);
                  setTimeout(() => {
                      checkingAlarm();
                      if (!alarmTone.paused) {
                          alarmTone.pause();
                          let palet = document.getElementById('alarmRingingPalet');
                          palet.style.display = 'none';
                      }
                  }, 50000);
              }
          }
          //   Alarm set with today weekday
          else if (element.DAYS.indexOf(todayDay) != -1) {
              element.DAYS.forEach(function(day) {
                  if (element.HOUR == checkHour && element.MINUTE == date.getMinutes() && currTime.includes(element.PERIOD) && todayDay == day && date.getSeconds() == 0 && element.TOGGLE == true) {
                      //   console.log('Alarm rang' + alarmTime + alarmPeriod + ' ' + 'Setting the weekday' + `${day}`);
                      alarmTone.addEventListener('ended', function() {
                          this.currentTime = 0;
                          this.play();
                      }, false);
                      alarmTone.play();
                      let palet = document.getElementById('alarmRingingPalet');
                      palet.style.display = 'flex';
                      palet.children[0].innerText = element.HOUR + ':' + element.MINUTE + ' ' + element.PERIOD;
                      palet.children[1].innerText = element.TITLE;

                      clearInterval(x);
                      setTimeout(() => {
                          checkingAlarm();
                          if (!alarmTone.paused) {
                              alarmTone.pause();
                              let palet = document.getElementById('alarmRingingPalet');
                              palet.style.display = 'none';
                          }
                      }, 50000);
                  }

              })
          } else {
              //  Alarm set not for today, so do nothing, just wait
          };
      });
  }


  //   When clicked on dismiss alarm button

  let dismiss = document.getElementById('dismissAlarm');
  dismiss.addEventListener('click', function() {
      alarmTone.pause();
      let palet = document.getElementById('alarmRingingPalet');
      palet.style.display = 'none';

  })
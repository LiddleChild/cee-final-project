class Calendar {
  constructor(elementCalendar, elementDate) {
    this.elementCalendar = elementCalendar;
    this.elementDate = elementDate;

    this.clear();
  }

  setOnSelectingDay(callbackOnSelectingDay) {
    this.callbackOnSelectingDay = callbackOnSelectingDay;
  }

  update(calendarData, date) {
    this.calendarData = calendarData;
    this.date = date;

    this.render();
  }

  clear() {
    this.update([], new Date());
  }

  render() {
    // Set date
    this.elementDate.innerHTML = this.date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
    });

    // Clear old children
    while (this.elementCalendar.firstChild)
      this.elementCalendar.removeChild(this.elementCalendar.firstChild);

    this.addEmptyDays();

    for (let i = 1; i <= this.getNumberOfDaysInMonth(this.date.getMonth()); i++) {
      let container = document.createElement("div");

      // day-of-month text
      let text = document.createElement("span");
      text.innerText = i;
      container.appendChild(text);

      // Add "pinned" class if there is any event(s) on this day
      if (this.calendarData)
        container.setAttribute("class", `active ${this.calendarData[i] ? "pinned" : ""}`);

      // Selected day
      container.onclick = (e) => this.callbackOnSelectingDay(e, i);

      this.elementCalendar.appendChild(container);
    }

    this.addNextMonthDays();
  }

  addEmptyDays() {
    let firstDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    let previousMonth = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);

    previousMonth = this.getNumberOfDaysInMonth(previousMonth.getMonth());
    for (let i = previousMonth - firstDayOfMonth.getDay() + 1; i <= previousMonth; i++) {
      let empty = document.createElement("div");
      empty.appendChild(document.createTextNode(i));
      empty.style.color = "#ccc";
      this.elementCalendar.appendChild(empty);
    }
  }

  addNextMonthDays() {
    let lastDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    lastDayOfMonth = lastDayOfMonth.getDay() + 1;

    for (let i = 1; i <= 7 - lastDayOfMonth; i++) {
      let day = document.createElement("div");
      day.appendChild(document.createTextNode(i));
      day.style.color = "#ccc";
      this.elementCalendar.appendChild(day);
    }
  }

  getNumberOfDaysInMonth(month) {
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }
}

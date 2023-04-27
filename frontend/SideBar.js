class SideBar {
  constructor(elementLists, elementDate) {
    this.elementLists = elementLists;
    this.elementDate = elementDate;
    this.clear();
  }

  update(lists, date) {
    this.lists = lists;
    this.date = date;

    this.render();
  }

  clear() {
    this.update([], new Date());
  }

  render() {
    // Set date
    this.elementDate.innerHTML = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Clear old children
    while (this.elementLists.firstChild)
      this.elementLists.removeChild(this.elementLists.firstChild);

    // Some events
    if (this.lists.length > 0) {
      // Convert to map of course to lists of assignments
      let courseAssignmentMap = {};
      for (let i of this.lists) {
        if (!courseAssignmentMap[i.course_title]) courseAssignmentMap[i.course_title] = [];
        courseAssignmentMap[i.course_title].push(i);
      }

      for (let ctitle of Object.keys(courseAssignmentMap)) {
        let item = document.createElement("div");

        // Add course title
        let courseName = document.createElement("h2");
        courseName.innerText = ctitle;
        item.appendChild(courseName);

        // Add all course's assignments
        let assignmentList = document.createElement("div");
        for (let assign of courseAssignmentMap[ctitle]) {
          let time = new Date(assign.assignment_duetime * 1000);
          let timeStr = time.toLocaleTimeString("en-US", { hour12: false });

          let assignmentItem = document.createElement("div");
          assignmentItem.innerText = `${timeStr} ${assign.assignment_title}`;
          assignmentList.appendChild(assignmentItem);
        }

        // Add assignments to list
        item.appendChild(assignmentList);

        // Add to main panel
        this.elementLists.appendChild(item);
      }
      // No event
    } else {
      let none = document.createElement("div");
      none.innerHTML = "Nothing to do today!";
      this.elementLists.appendChild(none);
    }

    // Add "add event" button
    let addButton = document.createElement("button");
    addButton.appendChild(document.createTextNode("+"));
    addButton.setAttribute("class", "addButton");
    // addButton.addEventListener("click",() => {
    //   let addTodo = document.querySelector(".add-todo");
    //   addTodo.classList.toggle("hidden");
    // })
    this.elementLists.appendChild(addButton);
  }
}

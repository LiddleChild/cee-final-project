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
    this.elementDate.innerHTML = this.date.toLocaleDateString("en-us", {
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
    addButton.addEventListener("click", () => {
      let addTodo = document.querySelector(".add-todo");
      addTodo.classList.toggle("hidden");
    });
    this.elementLists.appendChild(addButton);

    // Add "ass event" panel
    let addTodo = document.createElement("div");
    addTodo.setAttribute("class", "add-todo hidden");

    let addCourse = document.createElement("div");
    let addAssignment = document.createElement("div");
    let addDue = document.createElement("div");
    addCourse.setAttribute("class", "add-course");
    addAssignment.setAttribute("class", "add-assignment");
    addDue.setAttribute("class", "add-due");

    let courseInput = document.createElement("input");
    courseInput.setAttribute("class", "course-input");
    let assignmentInput = document.createElement("input");
    assignmentInput.setAttribute("class", "Assignment-input");
    let dueInput = document.createElement("input");
    dueInput.setAttribute("class", "due-input");
    dueInput.setAttribute("placeholder","hh:mm   e.g. 12:30")
    dueInput.addEventListener("input", (key) => {
      if (key.keyCode != 186) {
        dueInput.value = dueInput.value.replace(/[^0-9:]/g, "");
      }
    })

    addCourse.appendChild(
      document.createElement("div").appendChild(document.createTextNode("Course Title: "))
    );
    addCourse.appendChild(courseInput);
    addAssignment.appendChild(
      document.createElement("div").appendChild(document.createTextNode("Assignment Title: "))
    );
    addAssignment.appendChild(assignmentInput);
    addDue.appendChild(document.createElement("div").appendChild(document.createTextNode("Due: ")));
    addDue.appendChild(dueInput);

    let addTodoBtn = document.createElement("button");
    addTodoBtn.appendChild(
      document.createTextNode("Add")
    );
    addTodoBtn.setAttribute("class", "add-todo-btn");
    addTodoBtn.addEventListener("click",() => {
      if (dueInput.value.slice(2,3) != ":" ) {
        alert("Invalid Due Time");
      } else {
        let newObj = {};
        newObj.course_title = courseInput.value;
        newObj.assignment_title = assignmentInput.value
        let d = new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate(),dueInput.value.slice(0,2),dueInput.value.slice(3,5));
        newObj.assignment_duetime = Math.floor(d/1000);
        
        this.lists.push(newObj);
        this.update(this.lists,this.date);
      }
    })

    addTodo.appendChild(addCourse);
    addTodo.appendChild(addAssignment);
    addTodo.appendChild(addDue);
    addTodo.appendChild(addTodoBtn);
    this.elementLists.appendChild(addTodo);
  }
}

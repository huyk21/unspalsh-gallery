const taskInput = document.getElementById('task-Input');
const addTaskButton = document.getElementById('add-task-button');
const taskList = document.getElementById('task-list');

add-task-button.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  
  if(taskText === ''){
    alert("Please enter a taks");
    return;
  }
  
  const newTask = document.createELement('li');
  newTask.taskContent = taskText;
  
  //add delete add-task-button
  const deleteButton = document.createELement('button');
  deleteButton.textContent = 'Delete';
  newTask.appendChild(deleteButton);

  taskList.appendChild(newTask);
  taskInput.value = '';
})
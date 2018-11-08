/**
 * Prompts user to add a task to the list
 */
function add_task() {
    new_task = window.prompt("Enter the new task", "");
    if (new_task) 
        append_task(new_task);
}

/**
 * Appends a task to the list
 * 
 * @param {string} task The task to add
 */
function append_task(task) {
    var new_task = $("<li class='task'>").text(
        task);
    new_task.click(
        function () {
            $(this).toggleClass("completed");
        }
    );
    $(".list").append(new_task, "<hr>");
}

/**
 * Prompts user to remove a task from the list 
 */
function remove_task() {
    task_num = window.prompt("Enter the task number to remove", "");
    if (!isNaN(task_num))
        if (task_exists(task_num))
            drop_task(task_num);
        else if (!task_num === "")
            window.alert("That task number does not exist, try again.");
}

/**
 * Drops a task from the list
 * 
 * @param {number} task_num The task number to drop
 */
function drop_task(task_num) {
    $(".task").each(
        function (index) {
            curr_task = index + 1;
            if (Number(curr_task) === Number(task_num))
                $(this).remove();
        }
    );
}

/**
 * Checks to see if a particular task number exists
 * 
 * @param {number} task_num The task number to search for
 * @returns {boolean} Returns either a number or false if not found
 */
function task_exists(task_num) {
    var found, return_val;
    $(".task").each(
        function (index) {
            curr_task = index + 1;
            if (Number(curr_task) === Number(task_num)) {
                found = true;
                return_val = curr_task;
                return;
            }
        }
    );
    return found ? return_val : false;
}
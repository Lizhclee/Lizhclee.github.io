function drawCalendar(date) {
    // clear existing calendar
    var cal = document.getElementById("calendar");
    while (cal.firstChild) {
        cal.removeChild(cal.firstChild);
    }
    
    // draw new calendar
    var d = new Date(date);
    d.setDate(1);
    var today = new Date();
    
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    var weekday = d.getDay(); //check day of week
    
    // add month header
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var span = document.createElement("span");
    var text;
    
    td.setAttribute("colspan", "7");
    td.setAttribute("class", "head title");
    
    span.setAttribute("id", "month");
    
    text = document.createTextNode(months[d.getMonth()] + " " + d.getFullYear());
    
    span.appendChild(text);
    td.appendChild(span);
    tr.appendChild(td);
    cal.appendChild(tr);
    
    // add days header
    tr = document.createElement("tr");
    
    for (var i = 0; i < days.length; i++) {
        td = document.createElement("td");
        span = document.createElement("span");
        text = document.createTextNode(days[i]);
        
        span.appendChild(text);
        td.appendChild(span);
        td.setAttribute("class", "head");
        tr.appendChild(td);
    }
    
    cal.appendChild(tr);
    
    tr = document.createElement("tr");
    
    // if first day of month is not Sunday, insert blank box
    if (weekday > 0 && weekday < 7) {
        td = document.createElement("td");
        td.setAttribute("colspan", weekday);
        tr.appendChild(td);
    }
    
    // print the days of the month
    do {
        // if the day of the week is Sunday, place on next row
        if (d.getDay() == 0) {
            cal.appendChild(tr);
            tr = document.createElement("tr");
        }
        
        td = document.createElement("td");
        td.setAttribute("id", "day" + d.getDate());
        
        span = document.createElement("span");
        span.setAttribute("class", "day");
        
        text = document.createTextNode(d.getDate());
        
        span.appendChild(text);
        td.appendChild(span);
        tr.appendChild(td);
        
        d.setDate(d.getDate() + 1);
    } while (d.getDate() > 1);
    
    // fill rest of last row with an empty box
    if (d.getDay() > 0 && d.getDay() <= 6) {
        td = document.createElement("td");
        td.setAttribute("colspan", 7 - d.getDay());
        tr.appendChild(td);
    }
    
    cal.appendChild(tr);
    
    // highlight today's date
    if (d.getMonth() - 1 == today.getMonth() && d.getFullYear() == today.getFullYear()) {
        document.getElementById("day" + today.getDate()).className = "today";
    }
    
    // grey out past days
    d.setDate(d.getDate() - 1);
    for (var i = d.getDate(); i >=1; i--) {
        if (d.getFullYear() < today.getFullYear() || 
        d.getFullYear() == today.getFullYear() && d.getMonth() < today.getMonth() ||
        d.getFullYear() == today.getFullYear() && d.getMonth() == today.getMonth() && i < today.getDate()) {
            document.getElementById("day" + i).className = "past";
        }
    }
}

// upon first launch, show the current month
function currentMonth() {
    d = new Date();
    drawCalendar(d);
}

// show the previous month
function calculatePrev() {
    d.setMonth(d.getMonth() - 1);
    drawCalendar(d);
}

// show the next month
function calculateNext() {
    d.setMonth(d.getMonth() + 1);
    drawCalendar(d);
}

onload=currentMonth;
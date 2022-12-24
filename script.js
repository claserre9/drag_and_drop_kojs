function TimeSheetLine() {
    let self = this
    this.project = ko.observableArray(["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"])
    this.hour = ko.observable(0)

    this.chosenProject = ko.observable()


    this.handleDragStart = function (data, event) {
        event.dataTransfer.setData("text/plain", event.target.id)
        event.dropEffect = "move";
        return true

    }.bind(this)

    this.handleDragOver = function (data, event) {
    }

    this.handleDrop = function (data, event) {
        event.preventDefault()
        const draggedElement = document.querySelector(`#${event.dataTransfer.getData("text/plain")}`)
        const context = ko.contextFor(event.target)
        const draggedElementData = ko.dataFor(draggedElement)
        const dropZoneElementData = ko.dataFor(event.target)

        const timesheets = context.$parent.timesheets()
        const draggedElementPosition = ko.utils.arrayIndexOf(timesheets, draggedElementData)
        const dropZoneElementPosition = ko.utils.arrayIndexOf(timesheets, dropZoneElementData)

        timesheets.splice(dropZoneElementPosition, 0, timesheets.splice(draggedElementPosition, 1)[0]);

        context.$parent.timesheets(timesheets)

        return false
    }.bind(this)
}

function TimeSheet() {
    let self = this
    this.timesheets = ko.observableArray()

    this.showResult = ko.observable(false)

    this.addTimeSheetLine = function () {
        self.timesheets.push(new TimeSheetLine())
    }

    this.removeTimeSheetLine = function (index) {
        let timesheets = self.timesheets()
        timesheets.splice(index, 1)
        self.timesheets(timesheets)
    }

    this.resetTimeSheets = function () {
        self.timesheets([])
    }

    this.submitTimeSheets = function () {
        self.showResult(true)

    }

    this.result = function () {
        let newTs = ko.toJS(self.timesheets)
        ko.utils.arrayMap(newTs, function (t) {
            delete t.project
        })

        newTs = ko.utils.arrayFilter(newTs, function (t) {
            return ko.toJS(t)
        })

        return newTs

    }
    
    this.totalHours = function () {
        const initialValue = 0;
        return self.timesheets().reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue.hour()) ,
            initialValue
        )
    }
}

ko.applyBindings(new TimeSheet())
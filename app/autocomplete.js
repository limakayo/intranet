"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var AutoComplete = (function () {
    function AutoComplete(el) {
        this.el = el;
        this.query = '';
        this.filteredList = [];
        this.pos = -1;
        this.opened = false;
        this.items = [
            { id: 1, name: 'Darth Vader' },
            { id: 2, name: 'Kylo Ren' },
            { id: 3, name: 'Rey' },
            { id: 4, name: 'Ahsoka Tano' },
            { id: 5, name: 'Snoke' },
            { id: 6, name: 'Yoda' },
            { id: 7, name: 'Han Solo' },
            { id: 8, name: 'Luke Skywalker' },
            { id: 9, name: 'Obi-Wan Kenobi' },
            { id: 10, name: 'Darth Maul' },
            { id: 11, name: 'Chewbacca' },
            { id: 12, name: 'Boba Fett' },
            { id: 13, name: 'Darth Sidious' },
            { id: 14, name: 'Jabba the Hutt' },
            { id: 15, name: 'Qui-Gon Jinn' },
            { id: 16, name: 'Finn' },
            { id: 17, name: 'General Hux' },
            { id: 18, name: 'Poe Dameron' },
            { id: 19, name: 'Mace Windu' },
            { id: 20, name: 'Jar Jar Binks' }
        ];
        this.elementRef = el;
    }
    AutoComplete.prototype.filterQuery = function () {
        var _this = this;
        this.filteredList = this.items.filter(function (el) {
            return el.name.toLowerCase().indexOf(_this.query) > -1;
        });
    };
    AutoComplete.prototype.filter = function (event) {
        var _this = this;
        if (this.query !== '') {
            if (this.opened) {
                if ((event.keyCode >= 48 && event.keyCode <= 57) ||
                    (event.keyCode >= 65 && event.keyCode <= 90) ||
                    (event.keyCode == 8)) {
                    this.pos = 0;
                    this.filterQuery();
                }
                else if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
                    this.filteredList = this.items;
                }
            }
            else {
                this.filterQuery();
            }
        }
        else {
            if (this.opened) {
                this.filteredList = this.items;
            }
            else {
                this.filteredList = [];
            }
        }
        for (var i = 0; i < this.filteredList.length; i++) {
            this.filteredList[i].selected = false;
        }
        if (this.selectedItem) {
            this.filteredList.map(function (i) {
                if (i.id == _this.selectedItem.id) {
                    _this.pos = _this.filteredList.indexOf(i);
                }
            });
            this.selectedItem = null;
        }
        // Arrow-key Down
        if (event.keyCode == 40) {
            if (this.pos + 1 != this.filteredList.length)
                this.pos++;
        }
        // Arrow-key Up
        if (event.keyCode == 38) {
            if (this.pos > 0)
                this.pos--;
        }
        if (this.filteredList[this.pos] !== undefined)
            this.filteredList[this.pos].selected = true;
        //enter
        if (event.keyCode == 13) {
            if (this.filteredList[this.pos] !== undefined) {
                this.select(this.filteredList[this.pos]);
            }
        }
        // Handle scroll position of item
        var listGroup = document.getElementById('list-group');
        var listItem = document.getElementById('true');
        if (listItem) {
            listGroup.scrollTop = (listItem.offsetTop - 100);
        }
    };
    AutoComplete.prototype.select = function (item) {
        this.selectedItem = item;
        this.selectedItem.selected = true;
        this.query = item.name;
        this.filteredList = [];
        //this.opened = false;
    };
    AutoComplete.prototype.showAll = function (input) {
        input.select();
        if (this.filteredList.length > 0) {
            this.opened = false;
            this.filteredList = [];
        }
        else {
            this.opened = true;
            this.filteredList = this.items;
        }
        if (this.query === '') {
            this.clearAll();
        }
        this.clearSelects();
    };
    AutoComplete.prototype.handleKeyDown = function (event) {
        // Prevent default actions of arrows
        if (event.keyCode == 40 || event.keyCode == 38) {
            event.preventDefault();
        }
    };
    AutoComplete.prototype.clearAll = function () {
        if (this.filteredList) {
            for (var i = 0; i < this.filteredList.length; i++)
                this.filteredList[i].selected = false;
        }
    };
    /** Remove selected from all items of the list **/
    AutoComplete.prototype.clearSelects = function () {
        if (this.selectedItem) {
            for (var i = 0; i < this.filteredList.length; i++) {
                if (this.filteredList[i].id != this.selectedItem.id)
                    this.filteredList[i].selected = false;
            }
        }
    };
    /** Handle outside click to close suggestions**/
    AutoComplete.prototype.handleClick = function (event) {
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
            this.opened = false;
        }
    };
    AutoComplete = __decorate([
        core_1.Component({
            selector: 'autocomplete',
            template: "\n    <input #input type=\"text\" class=\"form-control input-list\" [(ngModel)]=\"query\" (keyup)=\"filter($event)\">\n    <button class=\"button-list\" (click)=\"showAll(input)\">\n      <i class=\"fa fa-sort-desc\" aria-hidden=\"true\"></i>\n    </button>\n\n    <ul id=\"list-group\" class=\"list-group group-list\" *ngIf=\"filteredList.length > 0\">\n        <li *ngFor=\"let item of filteredList\" [class.active]=\"item.selected\" [id]=\"item.selected\" class=\"list-group-item item-list\" (click)=\"select(item)\">\n          {{ item.name }}\n        </li>\n    </ul>\n\n    <p *ngIf=\"selectedItem\">Selected: {{ selectedItem | json }}</p>\n  ",
            host: {
                '(document:click)': 'handleClick($event)',
                '(keydown)': 'handleKeyDown($event)'
            },
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AutoComplete);
    return AutoComplete;
}());
exports.AutoComplete = AutoComplete;
//# sourceMappingURL=autocomplete.js.map
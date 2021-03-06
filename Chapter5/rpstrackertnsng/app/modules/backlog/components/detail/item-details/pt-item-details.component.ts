import {
    Component, OnInit, ChangeDetectionStrategy,
    Input, Output, EventEmitter, ViewChild
} from '@angular/core';

import { DataFormEventData } from 'nativescript-pro-ui/dataform';
import { RadDataFormComponent } from 'nativescript-pro-ui/dataform/angular';

import { PtItem } from '../../../../../core/models/domain';
import { PtItemDetailsEditFormModel, ptItemToFormModel } from '../../../../../shared/models/forms';
import { ItemType } from '../../../../../core/constants/pt-item-types';
import { PtItemType } from '../../../../../core/models/domain/types';
import { PriorityEnum } from '../../../../../core/models/domain/enums';
import { PT_ITEM_STATUSES, PT_ITEM_PRIORITIES, COLOR_LIGHT, COLOR_DARK } from '../../../../../core/constants';
import {
    setStepperEditorContentOffset, setStepperEditorTextPostfix,
    setStepperEditorColors, setMultiLineEditorFontSize, setSegmentedEditorColor, setPickerEditorImageLocation,
    getPickerEditorValueText
} from '../../../../../shared/helpers/ui-data-form';

@Component({
    moduleId: module.id,
    selector: 'pt-item-details',
    templateUrl: 'pt-item-details.component.html',
    styleUrls: ['pt-item-details.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PtItemDetailsComponent implements OnInit {

    @Input() item: PtItem;
    @Output() itemSaved = new EventEmitter<PtItem>();
    @ViewChild('itemDetailsDataForm') itemDetailsDataForm: RadDataFormComponent;

    private selectedTypeValue: PtItemType;
    private selectedPriorityValue: PriorityEnum;

    public itemForm: PtItemDetailsEditFormModel;
    public itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    public statusesProvider = PT_ITEM_STATUSES;
    public prioritiesProvider = PT_ITEM_PRIORITIES;

    public get itemTypeEditorDisplayName() {
        return 'Type';
    }

    public get itemTypeImage() {
        return ItemType.imageResFromType(this.selectedTypeValue);
    }


    constructor() { }

    public ngOnInit() {
        this.itemForm = ptItemToFormModel(this.item);

        this.selectedTypeValue = <PtItemType>this.itemForm.typeStr;
    }

    public onPropertyCommitted() {
        this.notifyUpdateItem();
    }

    private notifyUpdateItem() {
        this.itemDetailsDataForm.dataForm.validateAll()
            .then(ok => {
                if (ok) {
                    const updatedItem = this.getUpdatedItem();
                    this.itemSaved.emit(updatedItem);
                }
            })
            .catch(err => console.error(err));
    }

    private getUpdatedItem(): PtItem {
        const updatedItem = Object.assign({}, this.item, {
            title: this.itemForm.title,
            description: this.itemForm.description,
            type: this.itemForm.typeStr,
            status: this.itemForm.statusStr,
            priority: this.itemForm.priorityStr,
            estimate: this.itemForm.estimate,
        });
        return updatedItem;
    }

    public onEditorUpdate(args: DataFormEventData) {
        switch (args.propertyName) {
            case 'description': this.editorSetupDescription(args.editor); break;
            case 'estimate': this.editorSetupEstimate(args.editor); break;
            case 'priorityStr': this.editorSetupPriority(args.editor); break;
            case 'typeStr': this.editorSetupType(args.editor); break;
        }
    }

    private editorSetupDescription(editor) {
        setMultiLineEditorFontSize(editor, 17);
    }

    private editorSetupEstimate(editor) {
        // 1. set content offset
        setStepperEditorContentOffset(editor, -25, 0);
        // 2. set postfix
        setStepperEditorTextPostfix(editor, 'point', 'points');
        // 3. set colors
        setStepperEditorColors(editor, COLOR_LIGHT, COLOR_DARK);
    }

    private editorSetupPriority(editor) {
        const editorPriority = <PriorityEnum>editor.value;
        this.selectedPriorityValue = editorPriority ? editorPriority : <PriorityEnum>this.itemForm.priorityStr;
        setSegmentedEditorColor(editor, PriorityEnum.getColor(this.selectedPriorityValue));
    }

    private editorSetupType(editor) {
        setPickerEditorImageLocation(editor);
        this.selectedTypeValue = <PtItemType>getPickerEditorValueText(editor);
    }
}

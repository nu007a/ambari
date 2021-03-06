/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {FilteringService} from '@app/services/filtering.service';
import {LogsContainerService} from '@app/services/logs-container.service';
import {AppStateService} from '@app/services/storage/app-state.service';

@Component({
  selector: 'filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.less']
})
export class FiltersPanelComponent {

  constructor(private translate: TranslateService, private filtering: FilteringService, private logsContainer: LogsContainerService, private appState: AppStateService) {
    appState.getParameter('activeLogsType').subscribe(value => {
      this.logsType = value;
      logsContainer.logsTypeMap[value].fieldsModel.getAll().subscribe(fields => {
        if (fields.length) {
          const items = fields.filter(field => this.excludedParameters.indexOf(field.name) === -1).map(field => {
              return {
                name: field.displayName || field.name,
                value: field.name
              };
            }),
            labelKeys = items.map(item => item.name);
          translate.get(labelKeys).first().subscribe(translation => this.searchBoxItems = items.map(item => {
            return {
              name: translation[item.name],
              value: item.value
            };
          }));
        }
      })
    });
    filtering.loadClusters();
    filtering.loadComponents();
    filtering.loadHosts();
  }

  private readonly excludedParameters = ['cluster', 'host', 'level', 'type', 'logtime'];

  private logsType: string; // TODO implement setting the parameter depending on user's navigation

  searchBoxItems: any[] = [];

  get filters(): any {
    return this.filtering.filters;
  }

  get filtersForm(): FormGroup {
    return this.filtering.filtersForm;
  }

}

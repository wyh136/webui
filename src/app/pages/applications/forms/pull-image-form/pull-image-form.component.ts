import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { latestVersion } from 'app/constants/catalog.constants';
import { Catalog } from 'app/interfaces/catalog.interface';
import { PullContainerImageParams } from 'app/interfaces/container-image.interface';
import { EntityJobComponent } from 'app/pages/common/entity/entity-job/entity-job.component';
import { EntityUtils } from 'app/pages/common/entity/utils';
import { Observable } from 'rxjs';
import { TunableType } from 'app/enums/tunable-type.enum';
import helptext from 'app/helptext/apps/apps';
import { Tunable, TunableUpdate } from 'app/interfaces/tunable.interface';
import { FormErrorHandlerService } from 'app/pages/common/ix-forms/services/form-error-handler.service';
import { DialogService, WebSocketService } from 'app/services';
import { IxModalService } from 'app/services/ix-modal.service';

@UntilDestroy()
@Component({
  templateUrl: './pull-image-form.component.html',
  styleUrls: ['./pull-image-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PullImageFormComponent {
  isFormLoading = false;

  form = this.fb.group({
    username: [''],
    password: [''],
    from_image: ['', Validators.required],
    tag: [latestVersion],
  });

  readonly tooltips = {
    username: helptext.pullImageForm.username.tooltip,
    password: helptext.pullImageForm.password.tooltip,
    from_image: helptext.pullImageForm.imageName.tooltip,
    tag: helptext.pullImageForm.imageTags.tooltip,
  };

  constructor(
    private ws: WebSocketService,
    private modalService: IxModalService,
    private errorHandler: FormErrorHandlerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private translate: TranslateService,
    private dialogService: DialogService,
  ) {}

  onSubmit(): void {
    const values = this.form.value;

    const params: PullContainerImageParams = {
      from_image: values.from_image,
    };

    if (values.tag) {
      params.tag = values.tag;
    }
    if (values.username || values.password) {
      params.docker_authentication = {
        username: values.username,
        password: values.password,
      };
    }

    this.isFormLoading = true;
    const dialogRef = this.matDialog.open(EntityJobComponent, {
      data: {
        title: this.translate.instant('Pulling...'),
      },
      disableClose: true,
    });
    dialogRef.componentInstance.setCall('container.image.pull', [params]);
    dialogRef.componentInstance.submit();
    dialogRef.componentInstance.success.pipe(untilDestroyed(this)).subscribe(() => {
      this.isFormLoading = false;
      dialogRef.close();
      this.modalService.close();
    });
    dialogRef.componentInstance.failure.pipe(untilDestroyed(this)).subscribe((error) => {
      // TODO: Check if errors handled
      // TODO: Check if validation errors are handled
      this.isFormLoading = false;
      dialogRef.close();
      new EntityUtils().handleWSError(this, error, this.dialogService);
    });
  }
}

import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { REGION_OPTIONS, COMMITMENT_OPTIONS } from '../../types/models';

export interface IBulkEditValues {
  region?: string;
  commitment?: string;
  discountPercent?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface IBulkEditDialogProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCount: number;
  onApply: (values: IBulkEditValues) => void;
}

export const BulkEditDialog: React.FC<IBulkEditDialogProps> = ({
  isOpen,
  onDismiss,
  selectedCount,
  onApply,
}) => {
  const [values, setValues] = React.useState<IBulkEditValues>({});

  const handleApply = React.useCallback(() => {
    onApply(values);
    setValues({});
  }, [values, onApply]);

  const handleDismiss = React.useCallback(() => {
    setValues({});
    onDismiss();
  }, [onDismiss]);

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={handleDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: 'Bulk edit values',
        subText: `The input values apply only to the ${selectedCount} selected row item(s). If you do not wish to add a value in a field in bulk, you can skip it.`,
      }}
      modalProps={{ isBlocking: true }}
      minWidth={500}
    >
      <Stack tokens={{ childrenGap: 16 }}>
        <MessageBar messageBarType={MessageBarType.info}>
          Edit the values for selected products
        </MessageBar>

        <Dropdown
          label="Region"
          selectedKey={values.region || ''}
          options={REGION_OPTIONS as IDropdownOption[]}
          onChange={(_, opt) => setValues((v) => ({ ...v, region: opt?.key as string }))}
          placeholder="Leave unchanged"
        />

        <Dropdown
          label="Commitment"
          selectedKey={values.commitment || ''}
          options={COMMITMENT_OPTIONS as IDropdownOption[]}
          onChange={(_, opt) => setValues((v) => ({ ...v, commitment: opt?.key as string }))}
          placeholder="Leave unchanged"
        />

        <TextField
          label="Discount (%)"
          type="number"
          min={0}
          max={100}
          suffix="%"
          value={values.discountPercent !== undefined ? String(values.discountPercent) : ''}
          onChange={(_, val) => {
            const num = parseFloat(val || '');
            setValues((v) => ({
              ...v,
              discountPercent: isNaN(num) ? undefined : num,
            }));
          }}
          placeholder="Leave unchanged"
        />

        <DatePicker
          label="Start Date"
          value={values.startDate}
          onSelectDate={(date) => setValues((v) => ({ ...v, startDate: date || undefined }))}
          placeholder="Leave unchanged"
          showGoToToday
        />

        <DatePicker
          label="End Date"
          value={values.endDate}
          onSelectDate={(date) => setValues((v) => ({ ...v, endDate: date || undefined }))}
          placeholder="Leave unchanged"
          showGoToToday
        />

        <Text variant="small" styles={{ root: { fontStyle: 'italic', opacity: 0.7 } }}>
          Only filled fields will be updated. Empty fields will remain unchanged.
        </Text>
      </Stack>

      <DialogFooter>
        <PrimaryButton text="Apply Changes" onClick={handleApply} />
        <DefaultButton text="Cancel" onClick={handleDismiss} />
      </DialogFooter>
    </Dialog>
  );
};

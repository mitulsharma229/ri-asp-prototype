import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { TextField } from '@fluentui/react/lib/TextField';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { useTheme, ITheme } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: { padding: '16px 24px', flex: 1 },
    section: {
      backgroundColor: theme.palette.neutralLighterAlt,
      padding: '12px 16px',
      borderRadius: 4,
    },
    sectionHeader: {
      fontWeight: 600,
      fontSize: 14,
    },
    errorBox: {
      border: `1px solid #A80000`,
      borderRadius: 4,
      padding: '12px 16px',
      backgroundColor: '#FDE7E9',
    },
    noteBox: {
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: 4,
      padding: '12px 16px',
    },
    progressSection: {
      marginTop: 16,
    },
    progressRow: {
      padding: '6px 0',
    },
    successOverlay: {
      textAlign: 'center' as const,
      padding: 48,
    },
    cancelLink: {
      cursor: 'pointer',
    },
  })
);

type GeneratePhase = 'configure' | 'attestation' | 'generating' | 'success';

const outputTypeOptions: IChoiceGroupOption[] = [
  { key: 'preliminary', text: 'Preliminary' },
  { key: 'final', text: 'Final - send for approval' },
  { key: 'modifiable', text: 'Modifiable - for Deal CoE' },
];

interface IProgressItem {
  label: string;
  status: 'pending' | 'in-progress' | 'done';
}

export interface IGenerateDocumentsProps {
  onComplete: () => void;
  hasErrors: boolean;
}

export const GenerateDocuments: React.FC<IGenerateDocumentsProps> = ({ onComplete, hasErrors }) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [phase, setPhase] = React.useState<GeneratePhase>('configure');
  const [outputType, setOutputType] = React.useState<string>('final');
  const [cpsChecked, setCpsChecked] = React.useState(false);
  const [amendmentsChecked, setAmendmentsChecked] = React.useState(false);
  const [attestationDialogOpen, setAttestationDialogOpen] = React.useState(false);
  const [attestationChecked, setAttestationChecked] = React.useState(false);
  const [notesToApprover, setNotesToApprover] = React.useState('');
  const [containsACO, setContainsACO] = React.useState(false);
  const [containsECIF, setContainsECIF] = React.useState(false);
  const [cpsProgress, setCpsProgress] = React.useState(0);
  const [amendmentProgress, setAmendmentProgress] = React.useState(0);
  const [cpsItems, setCpsItems] = React.useState<IProgressItem[]>([]);
  const [amendItems, setAmendItems] = React.useState<IProgressItem[]>([]);

  const startGeneration = React.useCallback(() => {
    setAttestationDialogOpen(false);
    setPhase('generating');

    const cItems: IProgressItem[] = [
      { label: 'Preparing to generate price sheet', status: 'in-progress' },
      { label: 'Generating price sheet', status: 'pending' },
      { label: 'Generating product selection form', status: 'pending' },
      { label: 'Generating product selection form', status: 'pending' },
    ];
    const aItems: IProgressItem[] = [
      { label: 'Generating amendment document(s)', status: 'in-progress' },
    ];
    setCpsItems(cItems);
    setAmendItems(aItems);
    setCpsProgress(0.35);
    setAmendmentProgress(0.2);

    setTimeout(() => {
      setCpsProgress(0.6);
      setCpsItems(items => items.map((it, i) => ({
        ...it,
        status: i === 0 ? 'done' : i === 1 ? 'in-progress' : 'pending',
      })));
    }, 1500);

    setTimeout(() => {
      setCpsProgress(0.85);
      setCpsItems(items => items.map((it, i) => ({
        ...it,
        status: i <= 1 ? 'done' : i === 2 ? 'in-progress' : 'pending',
      })));
      setAmendmentProgress(0.6);
    }, 3000);

    setTimeout(() => {
      setCpsProgress(1);
      setCpsItems(items => items.map(it => ({ ...it, status: 'done' as const })));
      setAmendmentProgress(1);
      setAmendItems(items => items.map(it => ({ ...it, status: 'done' as const })));
      setPhase('success');
    }, 5000);
  }, []);

  const renderStatusIcon = (status: string) => {
    if (status === 'done') return <Icon iconName="SkypeCircleCheck" styles={{ root: { color: '#107C10', fontSize: 14 } }} />;
    if (status === 'in-progress') return <Spinner size={SpinnerSize.xSmall} />;
    return <Icon iconName="CircleRing" styles={{ root: { color: theme.palette.neutralTertiary, fontSize: 14 } }} />;
  };

  const renderStatusText = (status: string) => {
    if (status === 'in-progress') return <Text styles={{ root: { fontSize: 12, color: theme.palette.themePrimary } }}>In progress</Text>;
    if (status === 'pending') return <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralTertiary } }}>Pending</Text>;
    return null;
  };

  return (
    <Stack className={classNames.root} tokens={{ childrenGap: 16 }}>
      {phase === 'configure' && (
        <>
          <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Output Type</Text>
          <ChoiceGroup
            selectedKey={outputType}
            options={outputTypeOptions}
            onChange={(_, opt) => setOutputType(opt?.key || 'final')}
            styles={{ root: { marginBottom: 16 } }}
          />

          {/* CPS Section */}
          <Stack className={classNames.section} tokens={{ childrenGap: 8 }}>
            <Checkbox
              label="CPS"
              checked={cpsChecked}
              onChange={(_, c) => setCpsChecked(!!c)}
              disabled={hasErrors}
              styles={{ label: { fontWeight: 600 } }}
            />
            {hasErrors && (
              <Stack className={classNames.errorBox} tokens={{ childrenGap: 8 }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  <Icon iconName="Info" styles={{ root: { color: '#A80000' } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>
                    1 error(s) found in this scenario. Rectify all errors before generating the price sheet.
                  </Text>
                </Stack>
                <PrimaryButton text="Go to errors" styles={{ root: { width: 'fit-content' } }} />
              </Stack>
            )}
            <Stack className={classNames.noteBox} tokens={{ childrenGap: 6 }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="Info" styles={{ root: { color: theme.palette.themePrimary, fontSize: 14 } }} />
                <Text styles={{ root: { fontSize: 13 } }}>
                  <strong>Note:</strong> Please review this information thoroughly before proceeding with CPS generation as this will be used for approver/auditor review.
                </Text>
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 24 }} styles={{ root: { paddingLeft: 20 } }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  <Icon iconName="Warning" styles={{ root: { color: '#FFB900', fontSize: 14 } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>12</Text>
                  <Link styles={{ root: { fontSize: 13 } }}>Warnings</Link>
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  <Icon iconName="EntitlementRedemption" styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 14 } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>6</Text>
                  <Link styles={{ root: { fontSize: 13 } }}>Exceptions</Link>
                </Stack>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  <Icon iconName="TextDocument" styles={{ root: { color: theme.palette.neutralSecondary, fontSize: 14 } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>3</Text>
                  <Link styles={{ root: { fontSize: 13 } }}>Justifications</Link>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          {/* Amendments Section */}
          <Stack className={classNames.section} tokens={{ childrenGap: 8 }}>
            <Checkbox
              label="Amendments"
              checked={amendmentsChecked}
              onChange={(_, c) => setAmendmentsChecked(!!c)}
              styles={{ label: { fontWeight: 600 } }}
            />
            {hasErrors && (
              <Stack className={classNames.errorBox} tokens={{ childrenGap: 8 }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  <Icon iconName="Info" styles={{ root: { color: '#A80000' } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>
                    1 error(s) found in this scenario. Rectify all errors before generating the price sheet.
                  </Text>
                </Stack>
                <PrimaryButton text="Go to errors" styles={{ root: { width: 'fit-content' } }} />
              </Stack>
            )}
            <Stack className={classNames.noteBox} tokens={{ childrenGap: 6 }}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="Info" styles={{ root: { color: theme.palette.themePrimary, fontSize: 14 } }} />
                <Text styles={{ root: { fontSize: 13 } }}>
                  <strong>Note:</strong> Please review this information thoroughly before proceeding with amendment generation as this will be used for approver/auditor review.
                </Text>
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { paddingLeft: 20 } }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  <Icon iconName="Warning" styles={{ root: { color: '#FFB900', fontSize: 14 } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>12</Text>
                  <Link styles={{ root: { fontSize: 13 } }}>Warnings</Link>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}

      {phase === 'generating' && (
        <Stack tokens={{ childrenGap: 16 }}>
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>Generating documents</Text>
          <Text styles={{ root: { fontSize: 13 } }}>
            You may continue working on other deals by clicking <Link>here</Link>.
          </Text>
          <Text styles={{ root: { fontSize: 13 } }}>
            You will receive a notification & an email once the documents are generated.
          </Text>

          {/* CPS progress */}
          <Stack tokens={{ childrenGap: 4 }} className={classNames.progressSection}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>CPS documents</Text>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <Stack.Item grow><ProgressIndicator percentComplete={cpsProgress} styles={{ progressBar: { backgroundColor: theme.palette.themePrimary } }} /></Stack.Item>
              <Link className={classNames.cancelLink}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  <Icon iconName="Cancel" styles={{ root: { fontSize: 12 } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>Cancel</Text>
                </Stack>
              </Link>
            </Stack>
            <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>
              {Math.round(cpsProgress * 100)}% completed
            </Text>
            {cpsItems.map((item, i) => (
              <Stack key={i} horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} className={classNames.progressRow}>
                <Text styles={{ root: { flex: 1, fontSize: 13 } }}>{item.label}</Text>
                {renderStatusIcon(item.status)}
                {renderStatusText(item.status)}
              </Stack>
            ))}
          </Stack>

          {/* Amendment progress */}
          <Stack tokens={{ childrenGap: 4 }} className={classNames.progressSection}>
            <Text styles={{ root: { fontWeight: 600, fontSize: 14 } }}>Amendment documents</Text>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
              <Stack.Item grow><ProgressIndicator percentComplete={amendmentProgress} styles={{ progressBar: { backgroundColor: theme.palette.themePrimary } }} /></Stack.Item>
              <Link className={classNames.cancelLink}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                  <Icon iconName="Cancel" styles={{ root: { fontSize: 12 } }} />
                  <Text styles={{ root: { fontSize: 13 } }}>Cancel</Text>
                </Stack>
              </Link>
            </Stack>
            <Text styles={{ root: { fontSize: 12, color: theme.palette.neutralSecondary } }}>
              {Math.round(amendmentProgress * 100)}% completed
            </Text>
            {amendItems.map((item, i) => (
              <Stack key={i} horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} className={classNames.progressRow}>
                <Text styles={{ root: { flex: 1, fontSize: 13 } }}>{item.label}</Text>
                {renderStatusIcon(item.status)}
                {renderStatusText(item.status)}
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}

      {phase === 'success' && (
        <Stack horizontalAlign="center" className={classNames.successOverlay} tokens={{ childrenGap: 16 }}>
          <Icon iconName="SkypeCircleCheck" styles={{ root: { fontSize: 48, color: '#107C10' } }} />
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            Documents generated successfully
          </Text>
          <Text styles={{ root: { fontSize: 13 } }}>
            You will be redirected to the documents page.
          </Text>
          <Link onClick={onComplete}>Go to documents now</Link>
        </Stack>
      )}

      {/* Attestation Dialog */}
      <Dialog
        hidden={!attestationDialogOpen}
        onDismiss={() => setAttestationDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Before you generate documents & send for approval',
          subText: 'Please provide the below attestation:',
        }}
        modalProps={{ isBlocking: true }}
        minWidth={500}
      >
        <Stack tokens={{ childrenGap: 16 }}>
          <Toggle label="Does this scenario contain ACO?" checked={containsACO} onChange={(_, c) => setContainsACO(!!c)} />
          <Toggle label="Does this scenario contain ECIF?" checked={containsECIF} onChange={(_, c) => setContainsECIF(!!c)} />
          <TextField
            label="Notes to approver"
            multiline
            rows={3}
            value={notesToApprover}
            onChange={(_, val) => setNotesToApprover(val || '')}
            placeholder="To enter multiple values, separate by comma (,)"
          />
          <Checkbox
            label="I attest that I have reviewed all the information and it is accurate."
            checked={attestationChecked}
            onChange={(_, c) => setAttestationChecked(!!c)}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton text="Generate" onClick={startGeneration} disabled={!attestationChecked} />
          <DefaultButton text="Cancel" onClick={() => setAttestationDialogOpen(false)} />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

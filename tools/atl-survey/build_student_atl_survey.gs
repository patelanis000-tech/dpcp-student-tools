/**
 * DP/CP Student ATL Survey — one-run deployment
 *
 * Creates an anonymous Google Form and linked response spreadsheet,
 * moves both into the authoritative IB Evaluation project Drive folder,
 * and creates an ATL Summary sheet for selecting evidence-based priorities.
 *
 * Before running, set PROJECT_FOLDER_ID to the authoritative project folder ID
 * recorded on the 2027 IB Evaluation Preparation Notion page.
 */
function buildStudentATLSurvey() {
  const PROJECT_FOLDER_ID = 'SET_PROJECT_FOLDER_ID';
  const FORM_TITLE = 'DP/CP Student ATL Survey — 2026';
  const SHEET_TITLE = 'DP-CP Student ATL Survey Responses — 2026';

  if (PROJECT_FOLDER_ID === 'SET_PROJECT_FOLDER_ID') {
    throw new Error('Set PROJECT_FOLDER_ID before running this deployment.');
  }

  const categories = [
    'Communication skills',
    'Social skills',
    'Self-management skills',
    'Research skills',
    'Thinking skills'
  ];

  const definitions = [
    'Communication skills — expressing ideas clearly, listening, discussing, presenting and using communication appropriately.',
    'Social skills — collaborating, contributing to groups, resolving differences and working effectively with others.',
    'Self-management skills — organizing time and tasks, meeting deadlines, managing workload, staying motivated and reflecting on progress.',
    'Research skills — finding, evaluating, organizing and using information responsibly and effectively.',
    'Thinking skills — analysing, evaluating, making connections, solving problems, generating ideas and reflecting on how you think.'
  ];

  const folder = DriveApp.getFolderById(PROJECT_FOLDER_ID);
  const form = FormApp.create(FORM_TITLE, true);
  form
    .setDescription(
      'This survey is for current DP and CP students. It will help us identify two ATL (Approaches to Teaching and Learning) categories to prioritize for programme development.\n\n' +
      'Do not enter your name. Email addresses are not collected. Please answer based on your own current experience. There are no right or wrong answers.'
    )
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAcceptingResponses(true)
    .setConfirmationMessage('Thank you. Your response has been recorded and will be reviewed together with other student responses.');

  form.addMultipleChoiceItem()
    .setTitle('Which programme are you currently enrolled in?')
    .setChoiceValues(['DP', 'CP'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('What year of the programme are you in?')
    .setChoiceValues(['Year 1', 'Year 2'])
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('ATL categories')
    .setHelpText(definitions.join('\n\n'));

  const grid = form.addGridItem()
    .setTitle('Rank the five ATL categories by where you personally need the most development right now.')
    .setHelpText('Use each rank once. 1 = greatest development need; 5 = least development need.')
    .setRows(categories)
    .setColumns([
      '1 — Greatest need',
      '2',
      '3',
      '4',
      '5 — Least need'
    ])
    .setRequired(true);

  const gridValidation = FormApp.createGridValidation()
    .setHelpText('Use each ranking number only once.')
    .requireLimitOneResponsePerColumn()
    .build();
  grid.setValidation(gridValidation);

  form.addMultipleChoiceItem()
    .setTitle('Which ATL category do you currently feel strongest in?')
    .setChoiceValues(categories)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Why do you feel strongest in that category?')
    .setHelpText('A brief example from your learning is helpful.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('What specific ATL skill would make the biggest positive difference to your learning right now?')
    .setHelpText('For example: planning long tasks, evaluating sources, contributing in groups, explaining ideas clearly, or analysing difficult problems.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('What could teachers or the school do to help you develop ATL skills more effectively?')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Is there anything else you want us to understand about the skills you need to learn successfully and independently?')
    .setRequired(false);

  const ss = SpreadsheetApp.create(SHEET_TITLE);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(1500);

  const responseBook = SpreadsheetApp.openById(ss.getId());
  let responseSheet = responseBook.getSheets().find(s => s.getName() !== 'Sheet1');
  if (!responseSheet) {
    Utilities.sleep(1500);
    responseSheet = SpreadsheetApp.openById(ss.getId()).getSheets().find(s => s.getName() !== 'Sheet1');
  }
  if (!responseSheet) {
    throw new Error('The Form response sheet was not created.');
  }

  responseSheet.setName('Responses');

  const defaultSheet = responseBook.getSheetByName('Sheet1');
  if (defaultSheet && responseBook.getSheets().length > 1) {
    responseBook.deleteSheet(defaultSheet);
  }

  const summary = responseBook.insertSheet('ATL Summary');
  summary.getRange('A1:F1').merge().setValue('DP/CP Student ATL Survey — Evidence Summary');
  summary.getRange('A2').setValue('Total responses');
  summary.getRange('B2').setFormula('=COUNTA(Responses!A2:A)');
  summary.getRange('A4:F4').setValues([[
    'ATL category',
    'Average need rank',
    'Priority order',
    'Strongest-category count',
    'DP average',
    'CP average'
  ]]);

  categories.forEach((category, i) => {
    const row = 5 + i;
    const responseCol = String.fromCharCode('D'.charCodeAt(0) + i); // D:H
    summary.getRange(row, 1).setValue(category);
    summary.getRange(row, 2).setFormula(`=IFERROR(AVERAGE(Responses!${responseCol}2:${responseCol}),"")`);
    summary.getRange(row, 3).setFormula(`=IF(B${row}="","",RANK(B${row},$B$5:$B$9,1))`);
    summary.getRange(row, 4).setFormula(`=COUNTIF(Responses!I2:I,A${row})`);
    summary.getRange(row, 5).setFormula(`=IFERROR(AVERAGEIF(Responses!B2:B,"DP",Responses!${responseCol}2:${responseCol}),"")`);
    summary.getRange(row, 6).setFormula(`=IFERROR(AVERAGEIF(Responses!B2:B,"CP",Responses!${responseCol}2:${responseCol}),"")`);
  });

  summary.getRange('A11').setValue('Interpretation');
  summary.getRange('A12:F12').merge().setValue(
    'Lower average rank = greater reported development need. Use this as one evidence source alongside the qualitative responses and teacher survey; do not select categories from the numeric ranking alone.'
  );
  summary.setFrozenRows(4);
  summary.autoResizeColumns(1, 6);
  summary.getRange('A1:F1').setFontWeight('bold');
  summary.getRange('A4:F4').setFontWeight('bold');
  summary.getRange('A11').setFontWeight('bold');

  DriveApp.getFileById(form.getId()).moveTo(folder);
  DriveApp.getFileById(ss.getId()).moveTo(folder);

  const result = {
    formEditUrl: form.getEditUrl(),
    studentFormUrl: form.getPublishedUrl(),
    responseSheetUrl: ss.getUrl(),
    projectFolderId: PROJECT_FOLDER_ID
  };

  Logger.log(JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  return result;
}

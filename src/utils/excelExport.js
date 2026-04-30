const escapeXml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cell = (value, styleId = "Cell") => `
      <Cell ss:StyleID="${styleId}">
        <Data ss:Type="String">${escapeXml(value)}</Data>
      </Cell>`;

const row = (cells) => `
    <Row>
${cells.join("\n")}
    </Row>`;

export const downloadExcelWorksheet = ({ filename, sheetName, title, subtitle, columns, rows, summary = [] }) => {
  const summaryRows = summary
    .filter((item) => item?.label)
    .map((item) => row([cell(item.label, "LabelCell"), cell(item.value || "-", "Cell")]))
    .join("\n");

  const headerRow = row(columns.map((column) => cell(column.label, "HeaderCell")));

  const bodyRows = rows
    .map((item) =>
      row(
        columns.map((column) => {
          const value = typeof column.value === "function" ? column.value(item) : item?.[column.key];
          return cell(value ?? "-", "Cell");
        }),
      ),
    )
    .join("\n");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Borders/>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#0F172A"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="TitleCell">
      <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#0F172A"/>
    </Style>
    <Style ss:ID="SubtitleCell">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#475569"/>
    </Style>
    <Style ss:ID="LabelCell">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
      <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
    </Style>
    <Style ss:ID="HeaderCell">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#0F766E" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F766E"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F766E"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F766E"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F766E"/>
      </Borders>
    </Style>
    <Style ss:ID="Cell">
      <Alignment ss:Vertical="Top" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
    </Style>
  </Styles>
  <Worksheet ss:Name="${escapeXml(sheetName || "Sheet1")}">
    <Table>
      <Column ss:AutoFitWidth="1" ss:Width="140"/>
      <Column ss:AutoFitWidth="1" ss:Width="200"/>
      <Column ss:AutoFitWidth="1" ss:Width="160"/>
      <Column ss:AutoFitWidth="1" ss:Width="150"/>
      <Column ss:AutoFitWidth="1" ss:Width="140"/>
      <Column ss:AutoFitWidth="1" ss:Width="80"/>
      <Column ss:AutoFitWidth="1" ss:Width="220"/>
      <Column ss:AutoFitWidth="1" ss:Width="120"/>
      <Row>
        <Cell ss:MergeAcross="${Math.max(columns.length - 1, 1)}" ss:StyleID="TitleCell">
          <Data ss:Type="String">${escapeXml(title)}</Data>
        </Cell>
      </Row>
      <Row>
        <Cell ss:MergeAcross="${Math.max(columns.length - 1, 1)}" ss:StyleID="SubtitleCell">
          <Data ss:Type="String">${escapeXml(subtitle || "")}</Data>
        </Cell>
      </Row>
      <Row />
${summaryRows}
      <Row />
${headerRow}
${bodyRows}
    </Table>
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
      <FreezePanes/>
      <FrozenNoSplit/>
      <SplitHorizontal>1</SplitHorizontal>
      <TopRowBottomPane>1</TopRowBottomPane>
      <ProtectObjects>False</ProtectObjects>
      <ProtectScenarios>False</ProtectScenarios>
    </WorksheetOptions>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

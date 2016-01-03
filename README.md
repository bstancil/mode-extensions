# mode-extensions

## Visualizations

**Retention Heatmap**

`mode.rententionPivot( { object_of_options } )`  ([Live example](https://modeanalytics.com/modeanalytics/reports/f25a1764f2b4))

This visualization shows retention rates by cohort. It requires a dataset of at least three columns&mdash;a cohort column, a column to pivot cohorts on, and a value column. A fourth column for cohort size is optional.

`mode.retentionPivot` takes a single object as an input. The object should contain the following properties:

Property | Required? | Description
--- | --- | ---
`query_name` | Yes | The name of the query producing the dataset you want to use.
`cohort_column` | Yes | The column defining the cohort. These values will appear on the left-most column of the chart.
`pivot_columm` | Yes | The column cohorts are pivoted against. These values will appear across the top of the chart.
`value_column` | Yes | The value to shown in the cells in the body of the chart. If your data includes multiple rows for a single cohort and pivot value, the cell in the chart will show the average of all of the value column values.
`total_column` | No | The total size of each cohort. This will appear just to the right of the cohort column in the chart.
`title` | No | The title of your chart.
`pivot_label` | No | The label to appear above the values shown across the top of the chart.
`value_is_percent` | No | Boolean. If true, the value column values will be shown as a percent.
`html_element` | No | The HTML element the chart will be drawn in. Defaults to `body` if left blank.

A full example:

```
<script>
mode.retentionPivot(
  {
      html_element: "#graphic1",
      query_name: "Query 1",
      cohort_column: "cohort",
      pivot_column: "period",
      value_column: "retained_users",
      total_column: "cohort_size",
      title: "Total Users Retained",
      pivot_label: "Periods out",
      value_is_percent: false
    }
)
</script>
```
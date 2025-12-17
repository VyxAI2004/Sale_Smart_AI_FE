/**
 * Export Utilities - Functions to export dashboard data to Excel and PDF
 */
import type { DashboardResponse } from '../types/dashboard.types'

// Dynamic import for libraries
let XLSX: any
let jsPDF: any
let autoTable: any

// Lazy load libraries
async function loadXLSX() {
  if (!XLSX) {
    XLSX = await import('xlsx')
  }
  return XLSX
}

async function loadJsPDF() {
  if (!jsPDF) {
    const jsPDFModule = await import('jspdf')
    jsPDF = jsPDFModule.default || jsPDFModule
    // Import autoTable to register plugin
    await import('jspdf-autotable')
  }
  return jsPDF
}

/**
 * Export dashboard data to Excel
 */
export async function exportToExcel(
  dashboard: DashboardResponse,
  filename?: string
) {
  try {
    const XLSXModule = await loadXLSX()
    const workbook = XLSXModule.utils.book_new()

    // Sheet 1: Overview Stats
    const overviewData = [
      ['Dashboard Overview', ''],
      ['Generated at', new Date(dashboard.lastUpdated).toLocaleString()],
      [''],
      ['Projects Statistics', ''],
      ['Total Projects', dashboard.stats.projects.total],
      ['Active Projects', dashboard.stats.projects.active],
      ['Completed Projects', dashboard.stats.projects.completed],
      ['Pending Projects', dashboard.stats.projects.pending],
      [''],
      ['Products Statistics', ''],
      ['Total Products', dashboard.stats.products.total],
      ['Analyzed Products', dashboard.stats.products.analyzed],
      ['Products with Reviews', dashboard.stats.products.withReviews],
      [
        'Average Trust Score',
        `${(dashboard.stats.products.averageTrustScore * 100).toFixed(2)}%`,
      ],
      [''],
      ['Tasks Statistics', ''],
      ['Total Tasks', dashboard.stats.tasks.total],
      ['Completed Tasks', dashboard.stats.tasks.completed],
      ['Pending Tasks', dashboard.stats.tasks.pending],
      ['In Progress Tasks', dashboard.stats.tasks.inProgress],
      ['Overdue Tasks', dashboard.stats.tasks.overdue],
      [''],
      ['Reviews Statistics', ''],
      ['Total Reviews', dashboard.stats.reviews.total],
      ['Analyzed Reviews', dashboard.stats.reviews.analyzed],
      ['Positive Reviews', dashboard.stats.reviews.positive],
      ['Negative Reviews', dashboard.stats.reviews.negative],
      ['Neutral Reviews', dashboard.stats.reviews.neutral],
      ['Spam Reviews', dashboard.stats.reviews.spam],
      ['Average Rating', dashboard.stats.reviews.averageRating.toFixed(2)],
      [''],
      ['Trust Score Statistics', ''],
      [
        'Average Trust Score',
        `${(dashboard.stats.trustScores.average * 100).toFixed(2)}%`,
      ],
      ['High Trust Score (>=0.7)', dashboard.stats.trustScores.high],
      ['Medium Trust Score (0.4-0.69)', dashboard.stats.trustScores.medium],
      ['Low Trust Score (<0.4)', dashboard.stats.trustScores.low],
    ]

    const overviewSheet = XLSXModule.utils.aoa_to_sheet(overviewData)
    XLSXModule.utils.book_append_sheet(workbook, overviewSheet, 'Overview')

    // Sheet 2: Projects by Status
    const projectsData = [
      ['Status', 'Count'],
      ...dashboard.charts.projectsByStatus.map((item) => [
        item.name,
        item.value,
      ]),
    ]
    const projectsSheet = XLSXModule.utils.aoa_to_sheet(projectsData)
    XLSXModule.utils.book_append_sheet(
      workbook,
      projectsSheet,
      'Projects by Status'
    )

    // Sheet 3: Tasks by Status
    const tasksData = [
      ['Status', 'Count'],
      ...dashboard.charts.tasksByStatus.map((item) => [item.name, item.value]),
    ]
    const tasksSheet = XLSXModule.utils.aoa_to_sheet(tasksData)
    XLSXModule.utils.book_append_sheet(workbook, tasksSheet, 'Tasks by Status')

    // Sheet 4: Reviews by Sentiment
    const reviewsData = [
      ['Sentiment', 'Count'],
      ...dashboard.charts.reviewsBySentiment.map((item) => [
        item.name,
        item.value,
      ]),
    ]
    const reviewsSheet = XLSXModule.utils.aoa_to_sheet(reviewsData)
    XLSXModule.utils.book_append_sheet(
      workbook,
      reviewsSheet,
      'Reviews by Sentiment'
    )

    // Sheet 5: Products by Platform
    const productsData = [
      ['Platform', 'Count'],
      ...dashboard.charts.productsByPlatform.map((item) => [
        item.name,
        item.value,
      ]),
    ]
    const productsSheet = XLSXModule.utils.aoa_to_sheet(productsData)
    XLSXModule.utils.book_append_sheet(
      workbook,
      productsSheet,
      'Products by Platform'
    )

    // Sheet 6: Trust Score Distribution
    const trustScoreData = [
      ['Range', 'Count'],
      ...dashboard.charts.trustScoreDistribution.map((item) => [
        item.range,
        item.count,
      ]),
    ]
    const trustScoreSheet = XLSXModule.utils.aoa_to_sheet(trustScoreData)
    XLSXModule.utils.book_append_sheet(
      workbook,
      trustScoreSheet,
      'Trust Score Distribution'
    )

    // Sheet 7: Time Series
    const timeSeriesData = [
      ['Date', 'Projects', 'Products', 'Tasks', 'Reviews', 'Trust Score %'],
      ...dashboard.charts.timeSeries.map((item) => [
        item.date,
        item.projects,
        item.products,
        item.tasks,
        item.reviews,
        (item.trustScore * 100).toFixed(2),
      ]),
    ]
    const timeSeriesSheet = XLSXModule.utils.aoa_to_sheet(timeSeriesData)
    XLSXModule.utils.book_append_sheet(workbook, timeSeriesSheet, 'Time Series')

    // Sheet 8: Recent Activity
    const activityData = [
      ['Type', 'Title', 'Description', 'Status', 'Timestamp'],
      ...dashboard.charts.recentActivity.map((item) => [
        item.type,
        item.title,
        item.description,
        item.status || '',
        new Date(item.timestamp).toLocaleString(),
      ]),
    ]
    const activitySheet = XLSXModule.utils.aoa_to_sheet(activityData)
    XLSXModule.utils.book_append_sheet(
      workbook,
      activitySheet,
      'Recent Activity'
    )

    // Generate filename
    const exportFilename =
      filename ||
      `dashboard-export-${new Date().toISOString().split('T')[0]}.xlsx`

    // Write file
    XLSXModule.writeFile(workbook, exportFilename)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw new Error('Failed to export to Excel. Please try again.')
  }
}

/**
 * Export dashboard data to PDF
 */
export async function exportToPDF(
  dashboard: DashboardResponse,
  filename?: string
) {
  try {
    const jsPDFClass = await loadJsPDF()
    const doc = new jsPDFClass()

    let yPos = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin

    // Title
    doc.setFontSize(20)
    doc.text('Dashboard Report', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Generated at: ${new Date(dashboard.lastUpdated).toLocaleString()}`,
      margin,
      yPos
    )
    yPos += 15

    // Overview Section
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Overview Statistics', margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    const overviewRows = [
      ['Metric', 'Value'],
      ['Total Projects', dashboard.stats.projects.total.toString()],
      ['Active Projects', dashboard.stats.projects.active.toString()],
      ['Completed Projects', dashboard.stats.projects.completed.toString()],
      ['Pending Projects', dashboard.stats.projects.pending.toString()],
      ['Total Products', dashboard.stats.products.total.toString()],
      ['Analyzed Products', dashboard.stats.products.analyzed.toString()],
      [
        'Products with Reviews',
        dashboard.stats.products.withReviews.toString(),
      ],
      [
        'Average Trust Score',
        `${(dashboard.stats.products.averageTrustScore * 100).toFixed(2)}%`,
      ],
      ['Total Tasks', dashboard.stats.tasks.total.toString()],
      ['Completed Tasks', dashboard.stats.tasks.completed.toString()],
      ['In Progress Tasks', dashboard.stats.tasks.inProgress.toString()],
      ['Overdue Tasks', dashboard.stats.tasks.overdue.toString()],
      ['Total Reviews', dashboard.stats.reviews.total.toString()],
      ['Analyzed Reviews', dashboard.stats.reviews.analyzed.toString()],
      ['Positive Reviews', dashboard.stats.reviews.positive.toString()],
      ['Negative Reviews', dashboard.stats.reviews.negative.toString()],
      ['Average Rating', dashboard.stats.reviews.averageRating.toFixed(2)],
    ]

    ;(doc as any).autoTable({
      startY: yPos,
      head: [overviewRows[0]],
      body: overviewRows.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: margin, right: margin },
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Check if need new page
    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      yPos = 20
    }

    // Projects by Status
    doc.setFontSize(16)
    doc.text('Projects by Status', margin, yPos)
    yPos += 10

    const projectsRows = [
      ['Status', 'Count'],
      ...dashboard.charts.projectsByStatus.map((item) => [
        item.name,
        item.value.toString(),
      ]),
    ]

    ;(doc as any).autoTable({
      startY: yPos,
      head: [projectsRows[0]],
      body: projectsRows.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: margin, right: margin },
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      yPos = 20
    }

    // Tasks by Status
    doc.setFontSize(16)
    doc.text('Tasks by Status', margin, yPos)
    yPos += 10

    const tasksRows = [
      ['Status', 'Count'],
      ...dashboard.charts.tasksByStatus.map((item) => [
        item.name,
        item.value.toString(),
      ]),
    ]

    ;(doc as any).autoTable({
      startY: yPos,
      head: [tasksRows[0]],
      body: tasksRows.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: margin, right: margin },
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      yPos = 20
    }

    // Reviews by Sentiment
    doc.setFontSize(16)
    doc.text('Reviews by Sentiment', margin, yPos)
    yPos += 10

    const reviewsRows = [
      ['Sentiment', 'Count'],
      ...dashboard.charts.reviewsBySentiment.map((item) => [
        item.name,
        item.value.toString(),
      ]),
    ]

    ;(doc as any).autoTable({
      startY: yPos,
      head: [reviewsRows[0]],
      body: reviewsRows.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      margin: { left: margin, right: margin },
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      yPos = 20
    }

    // Products by Platform
    doc.setFontSize(16)
    doc.text('Products by Platform', margin, yPos)
    yPos += 10

    const productsRows = [
      ['Platform', 'Count'],
      ...dashboard.charts.productsByPlatform.map((item) => [
        item.name,
        item.value.toString(),
      ]),
    ]

    ;(doc as any).autoTable({
      startY: yPos,
      head: [productsRows[0]],
      body: productsRows.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: margin, right: margin },
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage()
      yPos = 20
    }

    // Trust Score Distribution
    doc.setFontSize(16)
    doc.text('Trust Score Distribution', margin, yPos)
    yPos += 10

    const trustScoreRows = [
      ['Range', 'Count'],
      ...dashboard.charts.trustScoreDistribution.map((item) => [
        item.range,
        item.count.toString(),
      ]),
    ]

    ;(doc as any).autoTable({
      startY: yPos,
      head: [trustScoreRows[0]],
      body: trustScoreRows.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: margin, right: margin },
    })

    // Generate filename
    const exportFilename =
      filename ||
      `dashboard-export-${new Date().toISOString().split('T')[0]}.pdf`

    // Save PDF
    doc.save(exportFilename)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw new Error('Failed to export to PDF. Please try again.')
  }
}

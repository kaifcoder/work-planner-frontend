// This is a mock email service for demonstration purposes
// In a real application, you would use a proper email service like SendGrid, Mailgun, etc.

export interface EmailOptions {
  to: string
  subject: string
  body: string
}

export async function sendEmail({ to, subject, body }: EmailOptions): Promise<boolean> {
  // In a real application, this would send an actual email
  console.log(`Sending email to ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)

  // Simulate a delay for sending the email
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return true to indicate success
  return true
}

export function sendTaskAssignmentEmail(
  taskId: string,
  taskTitle: string,
  userEmail: string,
  userName: string,
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: `New Task Assignment: ${taskTitle}`,
    body: `
      Hello ${userName},
      
      You have been assigned a new task: "${taskTitle}"
      
      Please log in to the Project Management System to view the details and update your progress.
      
      Thank you,
      Project Management Team
    `,
  })
}

export function sendTaskApprovalEmail(
  taskId: string,
  taskTitle: string,
  userEmail: string,
  userName: string,
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: `Task Approved: ${taskTitle}`,
    body: `
      Hello ${userName},
      
      Your task "${taskTitle}" has been approved by the manager.
      
      You can now start working on this task and update your progress in the Project Management System.
      
      Thank you,
      Project Management Team
    `,
  })
}

export function sendTaskRejectionEmail(
  taskId: string,
  taskTitle: string,
  userEmail: string,
  userName: string,
  reason?: string,
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: `Task Rejected: ${taskTitle}`,
    body: `
      Hello ${userName},
      
      Your task "${taskTitle}" has been rejected by the manager.
      
      ${reason ? `Reason: ${reason}` : ""}
      
      Please review and make necessary adjustments before resubmitting.
      
      Thank you,
      Project Management Team
    `,
  })
}

export function sendTaskCompletionEmail(
  taskId: string,
  taskTitle: string,
  managerEmail: string,
  userName: string,
): Promise<boolean> {
  return sendEmail({
    to: managerEmail,
    subject: `Task Completed: ${taskTitle}`,
    body: `
      Hello Manager,
      
      The task "${taskTitle}" has been marked as completed by ${userName}.
      
      Please review the completed task in the Project Management System.
      
      Thank you,
      Project Management Team
    `,
  })
}

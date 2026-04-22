---
title: "EntraReporter: Getting a complete picture of Entra ID role assignments"

description: A PowerShell module for producing a consolidated and exportable view of Entra ID role assignments, including permanent, eligible, group-based and time-limited access.

summary: EntraReporter is a PowerShell module that reports effective and future Entra ID role assignments by consolidating PIM schedules, eligible roles and group-based access into a single, automation-friendly output.

date: 2026-04-22

categories:
  - Identity Security

tags:
  - entra-id
  - azure-ad
  - pim
  - privileged-identity-management
  - role-assignments
  - identity-security
  - powershell
  - reporting

cover:
  image: israel-palacio-ImcUkZ72oUs-unsplash.jpg
  alt: Abstract representation of multiple connections between two systems
  caption: Photo by [israel palacio](https://unsplash.com/@othentikisra/) on [Unsplash](https://unsplash.com/photos/two-square-blue-led-lights-ImcUkZ72oUs)
---

When working with Entra ID role assignments, I often need a clear and defensible answer to a simple question:

> **Who actually has which roles – now and in the future?**

In most tenants, the answer you get depends on where you look: role blade, PIM, group membership, or audit logs. None of them answer the question in a way that is exportable, repeatable, or defensible during an audit.

In practice, this becomes less trivial once you factor in Privileged Identity Management (PIM), eligible assignments, group-based role assignments, and time-limited access. The information is available in Entra ID, but it is spread across multiple views and APIs, which makes repeatable reporting unnecessarily manual.

To address this, I built a small PowerShell module called **EntraReporter**.

***

## The problem it tries to solve

The Entra ID portal is well suited for interactive inspection, but it breaks down when you need a consolidated, repeatable view of privileged access.

This becomes especially apparent once you need to reason about permanent versus eligible assignments, access granted through PIM‑enabled groups, and time‑limited or future access. While all of this information exists in Entra ID, it is spread across different blades and APIs, making offline review, audit sharing, and repeatable reporting unnecessarily manual.

***

## What EntraReporter does


At the moment, EntraReporter focuses on one core task: **Reporting on Entra ID role assignments in a way that reflects effective access**.

By _effective_, I mean the final access a user ends up with after resolving direct and group-based assignments, eligible versus active state, and any overlapping time windows.

EntraReporter queries Entra ID role assignments and eligibility schedules via Microsoft Graph, including permanent assignments, PIM eligibility, group-based access, and time-limited roles. This information is normalised into a single list of actual and future role assignments.

The output consists of plain PowerShell objects, making the data suitable for automation, further processing, or export without assumptions about presentation.

More specifically, it:

* Queries Entra ID role assignments and eligibility schedules via Microsoft Graph
* Includes:
    * Permanent role assignments
    * Eligible assignments (PIM)
    * Assignments via PIM-enabled groups
    * Time-limited assignments
* Normalises this into a single list of actual and future role assignments
* Outputs plain PowerShell objects, suitable for further processing or export

The intent is not to replicate portal views, but to make the data usable in automation and reporting.

***

## Installation

The module is published to the PowerShell Gallery and requires an Entra ID P2 tenant, along with an account that can read PIM schedules.

```powershell
Install-Module EntraReporter -Scope CurrentUser
```

Alternatively, the source is available on GitHub:

*   <https://github.com/kovergard/EntraReporter>

Before running the `Get-EntraIdRoleAssignment` command, you must be connected to Microsoft Graph with the required scopes, as the module relies on Privileged Identity Management APIs.

To connect with the needed least-priviledge scopes, the following command can be used:

```powershell
Connect-MgGraph -Scopes `
  'RoleEligibilitySchedule.Read.Directory', `
  'RoleAssignmentSchedule.Read.Directory', `
  'PrivilegedEligibilitySchedule.Read.AzureADGroup', `
  'PrivilegedAssignmentSchedule.Read.AzureADGroup', `
  'LicenseAssignment.Read.All', `
  'AdministrativeUnit.Read.All', `
  'Application.Read.All'
```

But it will also work if you have more expansive scopes like `Directory.Read.All` instead.

***

## Example 1: Condensed overview of role assignments

Running the module without parameters returns a condensed set of properties that covers the most important aspects of each assignment.

```powershell
Get-EntraIdRoleAssignment
```

This produces a flattened list where wach row represents a single effective or future role assignment, including the role, the user, the scope, and the resolved effective state and time window.

This view is intended as a quick overview that can be filtered or inspected interactively.

Typical use cases:

* Sanity‑checking privileged access before a change
* Interactive filtering in PowerShell
* Answering “does this person effectively have Global Admin?”

{{< lightbox src="./assigned-roles-default.png" alt="Screenshot showing default output with condensed role assignment information" >}}

***

## Example 2: Exporting all assignment details to CSV

For auditing or customer reporting, it is often useful to export the full dataset.

```powershell
Get-EntraIdRoleAssignment |
    Export-Csv .\RoleAssignments.csv -NoTypeInformation -Encoding UTF8
```

This exports all available properties for each assignment, including identifiers, scopes, scheduling information, and calculated effective states.

The resulting CSV can be opened directly in Excel for further analysis or formatting.

Typical use cases:

* Audit evidence
* Customer deliverables
* Historical snapshots (when combined with scheduled runs)

{{< lightbox src="assigned-roles-excel.png" alt="Screenshot showing output with full role assignment information exported to Excel" >}}

The exported data makes it explicit whether access is direct or group-based, permanent or eligible, and whether time limits apply at either the group or role level.

This can be used to illustrate to auditors exactly who has which Entra role and how they are assigned to it.

***

## A note on implementation details

Under the hood, EntraReporter queries several Microsoft Graph endpoints related to Privileged Identity Management and role scheduling. 

The module consolidates assignment schedules, eligibility windows, group-based role assignments, and effective access periods into a single internal model.

Batch processing is used where possible to reduce API overhead, and the output is kept as raw objects to avoid assumptions about downstream usage.

***

## Limitations and assumptions


There are a few important limitations to be aware of:

- The tenant must have **Entra ID P2**, as the module relies on PIM-related endpoints.
- Nested group memberships are not expanded. This only affects PIM-enabled groups, as Entra ID does not support nesting inside role-assigned groups.
- If nested PIM groups are encountered, the command will issue a warning.

These are conscious trade-offs at this stage and may be revisited over time.


***

## Scope and future direction

I primarily built EntraReporter for my own use in customer environments, where having a repeatable and defensible overview of privileged access is essential.

The module will likely expand over time as additional reporting needs arise.

***

## Links

*   GitHub repository: <https://github.com/kovergard/EntraReporter>
*   PowerShell Gallery: <https://www.powershellgallery.com/packages/EntraReporter>

Feedback and corrections are welcome.

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
  caption: Photo by [israel palacio]https://unsplash.com/@othentikisra/) on [Unsplash](https://unsplash.com/photos/two-square-blue-led-lights-ImcUkZ72oUs)


draft: true
---

When working with Entra ID role assignments, I often need a clear and defensible answer to a simple question:

> **Who actually has which roles – now and in the future?**

In practice, this becomes less trivial once you factor in Privileged Identity Management (PIM), eligible assignments, group-based role assignments, and time-limited access. The information is available in Entra ID, but it is spread across multiple views and APIs, which makes repeatable reporting unnecessarily manual.

To address this, I built a small PowerShell module called **EntraReporter**.

***

## The problem it tries to solve

The Entra ID portal is well suited for interactive inspection, but less so for producing a consolidated report that can be:

*   exported
*   reviewed offline
*   shared with auditors or customers
*   rerun in a consistent way

This becomes especially apparent when you need to understand:

*   permanent vs eligible role assignments
*   assignments via PIM-enabled groups
*   time-limited access and future eligibility
*   effective access over time, not just “current state”

For security reviews and compliance work, manually stitching this together in the portal is both time-consuming and error-prone.

***

## What EntraReporter does

At the moment, EntraReporter focuses on one core task:  
**reporting on Entra ID role assignments in a way that reflects effective access.**

More specifically, it:

*   Queries Entra ID role assignments and eligibility schedules via Microsoft Graph
*   Includes:
    *   permanent role assignments
    *   eligible assignments (PIM)
    *   assignments via PIM-enabled groups
    *   time-limited assignments
*   Normalises this into a single list of **actual and future role assignments**
*   Outputs plain PowerShell objects, suitable for further processing or export

The intent is not to replicate portal views, but to make the data usable in automation and reporting.

***

## Installation

The module is published to the PowerShell Gallery.

```powershell
Install-Module EntraReporter -Scope CurrentUser
```

Alternatively, the source is available on GitHub:

*   <https://github.com/kovergard/EntraReporter>

Before running the module, you must be connected to Microsoft Graph with the required scopes, as the module relies on Privileged Identity Management APIs.

***

## Example 1: Condensed overview of role assignments

Running the module without parameters returns a condensed set of properties that covers the most important aspects of each assignment.

```powershell
Get-EntraIdRoleAssignment
```

This produces a flattened list where each row represents an effective or future role assignment, including information such as:

*   role name
*   principal (user, group, or service principal)
*   assignment type (active or eligible)
*   effective start and end time
*   assignment source (direct or via group)

This view is intended as a quick overview that can be filtered or inspected interactively.

> **Screenshot:** condensed output in PowerShell  
> *(add screenshot here)*

***

## Example 2: Exporting all assignment details to CSV

For auditing or customer reporting, it is often useful to export the full dataset.

```powershell
Get-EntraIdRoleAssignment |
    Export-Csv .\RoleAssignments.csv -NoTypeInformation -Encoding UTF8
```

This exports all available properties for each assignment, including identifiers, scopes, scheduling information, and calculated effective states.

The resulting CSV can be opened directly in Excel for further analysis or formatting.

> **Screenshot:** CSV imported into Excel showing all columns  
> *(add screenshot here)*

The module deliberately does not pre-format output or hide properties. The idea is to make it clear what data is available and let the consumer decide how it should be presented.

***

## A note on implementation details

Under the hood, EntraReporter queries several Microsoft Graph endpoints related to Privileged Identity Management and role scheduling. The module consolidates this data into a single model, resolving:

*   assignment schedules
*   eligibility windows
*   group-based role assignments
*   effective access periods

Batch processing is used where possible to reduce API overhead, and the output is kept as raw objects to avoid assumptions about downstream usage.

***

## Limitations and assumptions

There are a few important limitations to be aware of:

*   The tenant must have **Entra ID P2** enabled, as the module relies on PIM-related endpoints
*   **Nested group memberships are not currently expanded**

Both are conscious trade-offs at this stage and may be revisited over time.

***

## Scope and future direction

I primarily built EntraReporter for my own use in customer environments, where having a repeatable and defensible overview of privileged access is essential.

The module will likely expand over time as additional reporting needs arise, but the focus will remain on:

*   correctness over presentation
*   automation-friendly output
*   transparency in how access is calculated

***

## Links

*   GitHub repository: <https://github.com/kovergard/EntraReporter>
*   PowerShell Gallery: <https://www.powershellgallery.com/packages/EntraReporter>

Feedback and corrections are welcome.

'use strict'

const fs = require('fs')

const apiHandler = require('./utils/api-handler')
const asyncForEach = require('./utils/async-foreach')
const waitFor = require('./utils/wait-for')

const writeFile = async (fileName, data) => {
  const dataString = JSON.stringify(data)

  return new Promise((resolve, reject) => {
    fs.writeFile(`./ideascale-data/${fileName}.json`, dataString, error => {
      if (error) {
        console.log(`${fileName}.json error: `, error)
        reject(error)
      } else {
        console.log(`--- ${fileName}.json saved`)
        resolve(data)          
      }
    })
  })
}

// Millisecond delay value between endpoint calls to prevent hitting any rate limits
const msWaitForGap = 50

const main = async () => {
  console.log('*** Starting data extraction ***')

  const campaigns = await apiHandler('/v1/campaigns')

  console.log('- Campaigns: ', campaigns.length)

  await writeFile('campaigns', campaigns)

  await waitFor(msWaitForGap)

  const campaignsAndIdeas = []
  const campaignSubmissionConfig = []
  const campaignFields = []
  const campaignCustomFields = []

  await asyncForEach(campaigns, async campaign => {
    const ideaResponse = await apiHandler(`/v1/campaigns/${campaign.id}/ideas`)

    const sanitisedResponse = ideaResponse
      ? ideaResponse.map(camapign => ({
          ...camapign,
          authorInfo: {
            ...camapign.authorInfo,
            email: null,
            emailHash: null
          }
        })
      )
      : []

    campaignsAndIdeas.push({ ...campaign, ideas: sanitisedResponse })

    await waitFor(msWaitForGap)

    const configResponse = await apiHandler(`/v1/campaign/${campaign.id}/ideaSubmissionConfig`)
    campaignSubmissionConfig.push({ campaignId: campaign.id, fields: configResponse })    

    await waitFor(msWaitForGap)

    const fieldResponse = await apiHandler(`/v1/campaigns/${campaign.id}/fields`)
    campaignFields.push({ campaignId: campaign.id, fields: fieldResponse })

    await waitFor(msWaitForGap)

    const customFieldsResponse = await apiHandler(`/v1/customFields/idea/campaigns/${campaign.id}`)
    campaignCustomFields.push({ campaignId: campaign.id, customFields: customFieldsResponse })    
  })

  console.log('- Campaign ideas: ', campaignsAndIdeas.length)
  await writeFile('campaign-ideas', campaignsAndIdeas)

  console.log('- Campaign idea submission config: ', campaignSubmissionConfig.length)
  await writeFile('campaign-idea-submission-config', campaignSubmissionConfig)

  console.log('- Campaign fields: ', campaignFields.length)
  await writeFile('campaign-fields', campaignFields)

  console.log('- Campaign custom fields: ', campaignCustomFields.length)
  await writeFile('campaign-custom-fields', campaignCustomFields)

  const campaignsArchived = await apiHandler('/v1/campaigns/archived')

  console.log('- Campaigns archived: ', campaignsArchived.length)
  await writeFile('campaigns-archived', campaignsArchived)

  await waitFor(msWaitForGap)

  const stages = await apiHandler('/v1/stages')

  console.log('- Stages: ', stages.length)
  await writeFile('stages', stages)

  await waitFor(msWaitForGap)

  const tagsCounts = await apiHandler('/v1/tags/counts')

  console.log('- Tags: ', Object.keys(tagsCounts).length)
  await writeFile('tags', tagsCounts)

  await waitFor(msWaitForGap)

  const comments = []
  let commentsFinished = false
  let commentsPageNumber = 0
  const commentsPageSize = 50

  while (!commentsFinished) {
    try {
      const commentsResponse = await apiHandler(`/v1/comments/all/${commentsPageNumber}/${commentsPageSize}`)

      const sanitisedCommentsResponse = commentsResponse
        ? commentsResponse.map(comment => ({
            ...comment,
            authorInfo: {
              ...comment.authorInfo,
              email: null,
              emailHash: null
            }
          })
        )
        : []

      commentsPageNumber++
      if (sanitisedCommentsResponse) comments.push(...sanitisedCommentsResponse)

      await waitFor(msWaitForGap)

      if (sanitisedCommentsResponse && sanitisedCommentsResponse.length < commentsPageSize) commentsFinished = true
    } catch (error) {
      commentsFinished = true
      console.log('Comments error: ', error)
    }
  }

  console.log('- Comments: ', comments.length)
  await writeFile('comments', comments)

  const members = []
  let membersFinished = false
  let membersPageNumber = 0
  const membersPageSize = 50

  while (!membersFinished) {
    try {
      const membersResponse = await apiHandler(`/v1/members/${membersPageNumber}/${membersPageSize}`)

      const sanitisedMembersResponse = membersResponse
        ? membersResponse.map(member => ({
          ...member,
          email: null,
          emailHash: null
        })
        )
        : []

      membersPageNumber++
      if (sanitisedMembersResponse) members.push(...sanitisedMembersResponse)

      await waitFor(msWaitForGap)

      if (sanitisedMembersResponse && sanitisedMembersResponse.length < membersPageSize) membersFinished = true
    } catch (error) {
      membersFinished = true
      console.log('Members error: ', error)
    }
  }

  console.log('- Members: ', members.length)
  await writeFile('members', members)

  console.log('*** Completed data extraction ***')
}

main()
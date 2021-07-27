'use strict'

const apiHandler = require('./utils/api-handler')

async function formatResponse(body) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

module.exports.campaigns = async () => {
  const response = await apiHandler('/v1/campaigns')
  return formatResponse({ data: response })
}

module.exports.campaignsArchived = async () => {
  const response = await apiHandler('/v1/campaigns/archived')
  return formatResponse({ data: response })
}

module.exports.campaignsFields = async (event) => {
  const campaignId = event.pathParameters.campaignId
  const response = await apiHandler(`/v1/campaigns/${campaignId}/fields`)
  return formatResponse({ data: response })
}

module.exports.campaignsIdeas = async (event) => {
  const campaignId = event.pathParameters.campaignId
  const response = await apiHandler(`/v1/campaigns/${campaignId}/ideas`)

  const sanitisedResponse = response
    ? response.map(camapign => ({
        ...camapign,
        authorInfo: {
          ...camapign.authorInfo,
          email: null,
          emailHash: null
        }
      })
    )
    : []

  return formatResponse({ data: sanitisedResponse })
}

module.exports.campaignIdeaSubmissionConfig = async (event) => {
  const campaignId = event.pathParameters.campaignId
  const response = await apiHandler(`/v1/campaign/${campaignId}/ideaSubmissionConfig`)
  return formatResponse({ data: response })
}

module.exports.customFieldsIdeaCampaigns = async (event) => {
  const campaignId = event.pathParameters.campaignId
  const response = await apiHandler(`/v1/customFields/idea/campaigns/${campaignId}`)
  return formatResponse({ data: response })
}

module.exports.commentsAll = async (event) => {
  const pageNumber = event.pathParameters.pageNumber
  const pageSize = event.pathParameters.pageSize
  const response = await apiHandler(`/v1/comments/all/${pageNumber}/${pageSize}`)

  const sanitisedResponse = response
    ? response.map(comment => ({
        ...comment,
        authorInfo: {
          ...comment.authorInfo,
          email: null,
          emailHash: null
        }
      })
    )
    : []

  return formatResponse({ data: sanitisedResponse })
}

module.exports.members = async (event) => {
  const pageNumber = event.pathParameters.pageNumber
  const pageSize = event.pathParameters.pageSize
  const response = await apiHandler(`/v1/members/${pageNumber}/${pageSize}`)

  const sanitisedResponse = response
    ? response.map(member => ({
        ...member,
        email: null,
        emailHash: null
      })
    )
    : []

  return formatResponse({ data: sanitisedResponse })
}

module.exports.customFieldsMember = async () => {
  const response = await apiHandler('/v1/customFields/member')
  return formatResponse({ data: response })
}

module.exports.memberFields = async () => {
  const response = await apiHandler('/v1/members/fields')
  return formatResponse({ data: response })
}

module.exports.ideas = async (event) => {
  const pageNumber = event.pathParameters.pageNumber
  const pageSize = event.pathParameters.pageSize
  const response = await apiHandler(`/v1/ideas/${pageNumber}/${pageSize}`)

  const sanitisedResponse = response
    ? response.map(idea => ({
        ...idea,
        authorInfo: {
          ...idea.authorInfo,
          email: null,
          emailHash: null
        }
      })
    )
    : []

  return formatResponse({ data: sanitisedResponse })
}

module.exports.stages = async () => {
  const response = await apiHandler('/v1/stages')
  return formatResponse({ data: response })
}

module.exports.tagsCounts = async () => {
  const response = await apiHandler('/v1/tags/counts')
  return formatResponse({ data: response })
}

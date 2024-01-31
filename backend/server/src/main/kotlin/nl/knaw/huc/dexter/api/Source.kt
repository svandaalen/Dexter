package nl.knaw.huc.dexter.api

import ResultMetadataValue
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

data class FormSource(
    val title: String,
    val description: String,
    val rights: String,
    val access: AccessType,
    val creator: String,
    val externalRef: String? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
)

data class ResultSource(
    val id: UUID,
    val externalRef: String? = null,
    val title: String,
    val description: String,
    val rights: String,
    val access: AccessType,
    val creator: String,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

/**
 * With associated child resources
 */
data class ResultSourceWithResources (
    val id: UUID,
    val externalRef: String? = null,
    val title: String,
    val description: String,
    val rights: String,
    val access: AccessType,
    val creator: String,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,

    val keywords: List<ResultKeyword>,
    val languages: List<ResultLanguage>,
    val metadataValues: List<ResultMetadataValue>
)

fun ResultSource.toResultSourceWithResources(
    keywords: List<ResultKeyword>,
    languages: List<ResultLanguage>,
    metadataValues: List<ResultMetadataValue>
) = ResultSourceWithResources(
    id = id,
    externalRef = externalRef,
    title = title,
    description = description,
    rights = rights,
    access = access,
    creator = creator,
    location = location,
    earliest = earliest,
    latest = latest,
    notes = notes,
    createdBy = createdBy,
    createdAt = createdAt,
    updatedAt = updatedAt,

    keywords = keywords,
    languages = languages,
    metadataValues = metadataValues
)
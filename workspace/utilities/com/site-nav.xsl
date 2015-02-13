<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:import href="../lib/nav-link.xsl" />

<xsl:template name="site-nav">
	<nav id="site-nav" role="menu">
		<xsl:apply-templates select="/data/menu/entry" />
	</nav>
</xsl:template>

<xsl:template match="menu/entry">
	<div class="nav-link-ctn">
		<xsl:call-template name="nav-link">
			<xsl:with-param name="class" select="'nav-link'" />
			<xsl:with-param name="extra-param-key" select="." />
		</xsl:call-template>
	</div>
</xsl:template>

<xsl:template match="menu/entry" mode="nav-link-extra-param">
	<xsl:if test="string(access-key) != 0">
		<xsl:attribute name="accesskey">
			<xsl:value-of select="access-key" />
		</xsl:attribute>
	</xsl:if>
</xsl:template>

<xsl:template match="fl-languages/supported-languages/item" mode="revert-language" >
	<xsl:param name="full-name" select="'false'" />
	<xsl:param name="class" select="''" />
	<xsl:param name="text" select="''" />
	
	<a data-lg="{@handle}" class="js-alt-lg-link lang-alt-btn {$class}" data-action="full">
		<xsl:attribute name="href">
			<xsl:call-template name="page-alt-link-url">
				<xsl:with-param name="lg" select="@handle" />
			</xsl:call-template>
		</xsl:attribute>
		
		<xsl:choose>
			<xsl:when test="string-length($text) != 0">
				<xsl:value-of select="$text/item[@lang = current()/@handle]" />
			</xsl:when>
			<xsl:when test="$full-name = 'true'">
				<xsl:value-of select="." />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring(.,1,2)" />
			</xsl:otherwise>
		</xsl:choose>
	</a>
</xsl:template>

</xsl:stylesheet>

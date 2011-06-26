# -*- coding: utf-8 -*-
# vim: sw=4 ts=4 fenc=utf-8
# =============================================================================
# $Id: __init__.py 47 2008-02-21 18:11:45Z s0undt3ch $
# =============================================================================
#             $URL: http://devnull.ufsoft.org/svn/ImageBoxWidget/trunk/__init__.py $
# $LastChangedDate: 2008-02-21 18:11:45 +0000 (Thu, 21 Feb 2008) $
#             $Rev: 47 $
#   $LastChangedBy: s0undt3ch $
# =============================================================================
# Copyright (C) 2007 Ufsoft.org - Pedro Algarvio <ufs@ufsoft.org>
#
# Please view LICENSE for additional licensing information.
# =============================================================================

from os.path import join, dirname
from textpress.api import add_link, add_script, add_header_snippet, url_for

SHARED_FILES = join(dirname(__file__), 'shared')

def inject_javascript(req):
    add_link('stylesheet',
             url_for('imagebox/shared', filename='jquery.imgbox.css'),
             'text/css')
    add_script(url_for('imagebox/shared', filename='jquery.center.js'))
    add_script(url_for('imagebox/shared', filename='jquery.imgbox.js'))
    add_header_snippet(
        '<script type="text/javascript">'
            '$(document).ready( function() {  $(".imagebox").imgbox(); });'
        '</script>')

def setup(app, plugin):
    app.add_shared_exports('imagebox', SHARED_FILES)
    #app.connect_event('process-doc-tree', process_doc_tree)
    app.connect_event('after-request-setup', inject_javascript)


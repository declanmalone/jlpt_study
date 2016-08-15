#!/usr/bin/perl

use strict;
use warnings;

use Model::KanjiReadings;

use Gtk2 qw(-init);
use Gtk2::Ex::FormFactory;

use utf8;
#require GUI::KanjiExplorer;

binmode STDERR, ":utf8";
binmode STDOUT, ":utf8";

GUI::KanjiExplorer->new->build_window;

Gtk2->main;

# Until I figure out how to control auto-commit from with the program,
# I'll have to do it manually on program exit
print "Exiting; writing data to database\n";
KanjiReadings::DBI->dbi_commit;

package GUI::KanjiExplorer;

use strict;
use warnings;
use Util::JA_Script qw(has_kanji has_hira strip_non_kanji);

use Carp;

use Glib qw/TRUE FALSE/; 
use YAML::Any qw(LoadFile);

use constant {
    COL_VOCAB_ID   => 1,
    COL_VOCAB      => 2,
    COL_VOCAB_KANA => 3,
};



our ($AUTOLOAD, %get_set_attr, $DEBUG, $kanjivg_dir, $rtkinfo);
BEGIN {
    $DEBUG=1;
    %get_set_attr = (
	    map { ($_ => undef) } 
	    qw(selected_kanji search_term search_term_presets
    ));
    $kanjivg_dir = '/home/dec/JLPT_Study/kanjivg/kanjivg-r20160426/kanji';
    $rtkinfo = LoadFile("./rtk_kanji.yaml") or die;
    
}
sub AUTOLOAD {
    my $self = shift;
    my $attr = $AUTOLOAD;
    if ($attr =~ s/^.*::get_//) {
	warn "GUI: get_$attr\n" if $DEBUG;
        croak "Method get_$attr not registered for autoloading"
            unless exists $get_set_attr{$attr};
        return $self->{$attr};
    }
    if ($attr =~ s/^.*::set_//) {
	warn "GUI: set_$attr($_[0])\n" if $DEBUG;
        croak "Method set_$attr not registered for autoloading"
            unless exists $get_set_attr{$attr};
        return $self->{$attr}=shift;
    }

    croak "Method $attr does not exist";
}


sub new {
    my $class = shift;
    my $context = shift || Gtk2::Ex::FormFactory::Context->new;
    
    my $self = bless { context => $context };
    
    $self->{search_term_presets} = ['雨', 'rain'];

    $context->add_object(
	name => "gui",
	object => $self,
	attr_depends_href => {
	    search_term => "gui.selected_kanji", # works OK when we update history
	}
    );
    
    $context->add_object(
	name => "kanji",
	attr_accessors_href => {
	    get_summary => sub {
		warn "Asked to get summary\n";
		my $self = shift;
		"Summary: $self->{kanji}; self is of type " . ref($self);
	    },
	    get_failed => sub {
		warn "Asked to get failed\n";
		my $self = shift;
		#warn "failed: $self->{kanji}; self is of type " . ref($self);
		my @outlist = ();
		if ("new" ) {
		    # !! Change later when Summary -> Kanji
		    my @failed = grep { 0 == $_->yomi_id } $self->kv_link;
		    foreach my $link (@failed) {
			my $v = $link->vocab_id;
			push @outlist, [
			    "N" . $v->jlpt_grade,
			    # Hidden field containing vocab_id
			    "" . $v->vocab_id,
			    $v->vocab_ja,
			    $v->vocab_kana,]
		    }
		}
		\@outlist;
	    },
	    get_matched => sub {
		my $self = shift;
		warn "Asked to get matched, kanji is " . $self->kanji . "\n";
		my @outlist = ();
		if ("new") {
		    # !! Change later when Summary -> Kanji
		    foreach my $link ($self->kv_link) {
			next if 0 == $link->yomi_id;
			my $v = $link->vocab_id;
			my $y = $link->yomi_id;
			push @outlist, [
			    "N" . $v->jlpt_grade,
			    # Hidden field containing vocab_id
			    "" . $v->vocab_id,
			    $v->vocab_ja,
			    $v->vocab_kana,
			    $y->yomi_type,
			    $y->yomi_kana,
			]
		    }
		}
		\@outlist;
	    },
	    get_rtk_info => sub {
		my $self  = shift;
		my $kanji = $self->kanji;

		my $rtk;
		if (exists($rtkinfo->{by_kanji}->{$kanji})) {
		    $rtk = $rtkinfo->{by_kanji}->{$kanji};
		} else {
		    $rtk = {
			frame  => "n/a",
			keyword => "n/a",
		    }
		}
		return "#" . $rtk->{frame} . ": " . $rtk->{keyword};
	    },
	    get_tallies => sub {
		my $self = shift;
		warn "Asked to get tallies, kanji is " . $self->kanji . "\n";
		my @outlist = ();
		my $has_failed = 0;
		my $eg_failed = '';
		foreach my $tally ($self->tallies) {
		    my $y = $tally->yomi_id;
		    if (0 == $y) {
			$has_failed += $tally->adj_count || $tally->yomi_count;
			$eg_failed = $tally->exemplary_vocab->vocab_ja if
			    $tally->exemplary_vocab_id;
			next;
		    };
		    push @outlist, [
			$tally->adj_count || $tally->yomi_count,
			$y->yomi_type,
			$y->yomi_kana,
			$tally->exemplary_vocab_id ? $tally->exemplary_vocab->vocab_ja : '',
			]
		}
		# put failed at the end, but only if at least one exists
		if ($has_failed) {
		    push @outlist, [
			$has_failed,
			"-",
			"-",
			$eg_failed,
		    ];
		}
		\@outlist;
	    },
	    get_image_file => sub {
		my $self = shift;
		my $kanji = $self->kanji;
		warn "Asked to get image file, kanji is $kanji\n";
		my $unicode = sprintf("%05x", ord $kanji);

		# Unfortunately, my Gtk2::Gdk::Pixbuf is saying it
		# doesn't recognise the svg file ...
		# https://bugs.launchpad.net/ubuntu/+source/gdk-pixbuf/+bug/926019
		# If I delete the comment, it works...
		my $filename = "$kanjivg_dir/$unicode.svg";
		return $filename;

		# OK, can't use filename#id notation as below...
		# my $filename = "/home/dec/JLPT_Study/kanjivg/kanjivg-20160426.xml";
		# warn "No file $filename" unless -f $filename;
		# return "$filename#kvg:kanji_$unicode";
		
		# There seems to be a bug in gdk-pixbuf. It's supposed
		# to look through the first 4,096 characters of the
		# file to find the starting tag for the svg, but it
		# doesn't work. I've tried messing with patterns in
		# loaders.cache but it didn't work. As a workaround,
		# I'm stripping out all the comments:
		#
		# perl -i.bak -nle 'print unless m|^<!--| .. m|-->$|' *.svg

		
	    },
	},
	attr_depends_href => {
	    matched     => "gui.selected_kanji",
	    summary     => "gui.selected_kanji",
	    failed      => "gui.selected_kanji",
	    tallies     => "gui.selected_kanji",
	    image_file  => "gui.selected_kanji",
	    rtk_info    => "gui.selected_kanji",
	},
	aggregated_by => "gui.selected_kanji",
    );

    return $self;
  
}

sub build_window {

    my $self = shift;
    my $context = $self->{context};

    my $ff = Gtk2::Ex::FormFactory->new(
	context => $context,
	content => [
	    Gtk2::Ex::FormFactory::Window->new(
		quit_on_close => 1,
		expand => 1,
		#		height => 600,
		
		width  => 600,
		content => [
		    Gtk2::Ex::FormFactory::Table->new(
			expand => 1,
			layout => <<'END',
                        +---->----------------+---------+
                        '     Search Box      '  Go     |
                        +->>----------------+-+-->------+
                        ^ Pixbuf            | Matched   |
                        +--------%----------+           |
                        |       RTK         |           |
                        +-------------------+           |
                        |          Tallies  |           |
                        +-------------------+-----------+
                        ^          Failed               |
                        +-------------------------------+
END
			content => [
			    $self->build_search,
			    $self->build_go,
			    $self->build_pixbuf,
			    $self->build_matched,
			    $self->build_rtk,
			    $self->build_tallies,
			    $self->build_failed,
#			    $self->build_summary,
			],
		    ),
		    Gtk2::Ex::FormFactory::Button->new(
			label => 'Reload Program',
			clicked_hook => sub { exec $0, @ARGV or die },
		    ),
		],
	    ),
	]
	);

    $self->{ff} = $ff;
    $ff->open;
    $ff->update_all;

}

sub build_search {
    my $self = shift;
    Gtk2::Ex::FormFactory::Combo->new(
	label   => "Enter a kanji or an RTK frame number/keyword",
	attr    => "gui.search_term",
	# later implement history feature
    )
}

# jump_to_kanji was initially handled in the go button handler, but
# I'm breaking it out here to reuse when I add a right-click menu to
# table elements to allow jumping to other kanji found within compound
# words. The optional term argument could be a keyword or frame
# number, which is what I'll actually store in the history rather than
# necessarily converting it.
sub jump_to_kanji {
    my $self = shift;
    my $kanji = shift or die;
    my $term  = shift || $kanji;

    my $context = $self->{context};

    # Handle history
    my $history = $self->{search_term_presets};
    if ($term ne $history->[0]) {
	unshift @$history, $term;
	shift   @$history if @$history > 40;
	#warn "New history is " . join ", ",  @$history;
    }

    warn "jump_to_kanji: kanji is $kanji\n";
    $self->{kanji} = $kanji;

    $context->set_object_attr("gui.search_term",'');
    $context->set_object_attr("gui.selected_kanji",
			      KanjiReadings::Kanji->retrieve($kanji));
}

sub build_go {
    my $self = shift;
    Gtk2::Ex::FormFactory::Button->new(
	label        => 'Search',
	attr         => 'gui.selected_kanji',
	clicked_hook => sub {
	    my $term  = $self->get_search_term;
	    my $kanji = $term;
	    unless ($term) {
		warn "Blank search\n"; return 
	    }

	    # Look up Heisig/RTK keywords or frame numbers
	    if ($term =~ /(\d+)/) {
		warn "Looking up number in RTK index\n";
		$kanji = $rtkinfo->{by_frame}->[$term = $1]->{kanji}
	    } elsif (!has_kanji($term)) {
		warn "No kanji characters, looking up as RTK keyword\n";
		$kanji = $rtkinfo->{by_keyword}->{$term}->{kanji}
	    }
	    
	    $self->jump_to_kanji($kanji,$term);
	}
    )
}

sub build_summary {
    my $self = shift;
    Gtk2::Ex::FormFactory::Form->new(
	content => [
	    Gtk2::Ex::FormFactory::Label->new(
		label   => "Summary of readings",
		attr => "kanji.summary",
	    ),
#	    Gtk2::Ex::FormFactory::List->new(
#		attr => "kanji.summary",
#		columns => ["JLPT", "Vocab", "Reading", "Type", "Kana"],
#	    )
	],
    );
}

sub build_pixbuf {
    my $self  = shift;
    my $kanji = $self->{kanji};

    Gtk2::Ex::FormFactory::Image->new(
	attr => "kanji.image_file",
	bgcolor => "#ffffff",
	# height => 400, # does nothing!
	scale_to_fit => 1, 
	# scale => 1.25,
    );
}


sub build_rtk {
    my $self  = shift;

    Gtk2::Ex::FormFactory::Label->new(
	attr => "kanji.rtk_info",
    );
}

sub build_jouyou_grade {
    
}

sub build_tallies {
    my $self = shift;
    Gtk2::Ex::FormFactory::Form->new(
#	height  => 120,
	expand  => 1,
	content => [
	    Gtk2::Ex::FormFactory::Label->new(
		label   => "Reading Tallies",
	    ),
	    Gtk2::Ex::FormFactory::List->new(
		attr => "kanji.tallies",
		columns => ["Count", "Type", "Reading", "Exemplar", ],
		height  => 120,
		scrollbars => ["never", "automatic"],
		#		expand => 1,
		signal_connect => {
		    # Double-clicking will allow selection of all
		    # vocab with the selected reading
		    row_activated => sub  {
			# Passed values are of the types:
			# Gtk2::SimpleList
			# Gtk2::TreePath
			# Gtk2::TreeViewColumn
			# from Gtk2::SimpleList pod:
			my ($sl, $path, $column) = @_;
			my $row_ref = $sl->get_row_data_from_path ($path);
			my $kana = $row_ref->[COL_VOCAB_KANA];

			# Talk to the underlying Gtk2::Ex::Simple::List
			my $list = $self->{ff_matched};
			my $gtk  = $list->get_gtk_widget;
			$gtk->get_selection->unselect_all;
			my $i = 0;
			for my $row (@{$list->get_data}) {
			    $gtk->select($i) if ($row->[4] eq $kana);
			    ++$i;
			}
		    },

		    # Kind of hard to find examples for how to do a
		    # popup menu and clipboard pasting. Figured this
		    # from various sources...
		    button_press_event => sub {
			my ($sl,$event) = @_;
			# Need to consume right mouse button press or
			# else GTK will consider it to be a selection
			return ($event->button == 3);
		    },
		    button_release_event => sub {
			my ($sl, $event) = @_;
			return 0 if ($event->button != 3);
			warn "Got right-click on tallies table\n";
			# Find out where the click went
			my ($path, $col, $cell_x, $cell_y)
			    = $sl->get_path_at_pos ($event->x, $event->y);
			# Find row based on the TreeView path
			my $row_ref = $sl->get_row_data_from_path ($path);
			warn "row_ref is of type " . ref($row_ref);
			warn "This row contains " . (join ", ", @$row_ref) . "\n";

			# Build a popup menu with option to copy text
			my $copy_text = $row_ref->[2];
			my $menu = Gtk2::Menu->new();
			my $menu_item = Gtk2::MenuItem->new("Copy $copy_text");
			$menu_item->signal_connect(
			    activate => sub {
				Gtk2::Clipboard->get(Gtk2::Gdk->SELECTION_CLIPBOARD)
				    ->set_text($copy_text);
			    }
			);
			$menu_item->show;
			$menu->append($menu_item);

			warn "menu is a " . ref($menu);
			#$menu->popup($event->x,$event->y,$event->button, $event->time);
			$menu->popup(undef,undef,undef,undef,$event->button, $event->time);

			return 1;
		    }
		},
	    )
	],
    );
}

# Build a menu that can be used on either the matched or failed
# panels. Meant to be called from a button_press_event handler.
sub vocab_panel_popup_menu {
    my ($self, $sl, $event, $panel) = @_;
    return 0 if ($event->button != 3);

    warn "Got right-click on $panel table\n";

    # Find out where the click went
    my ($path, $col, $cell_x, $cell_y)
	= $sl->get_path_at_pos ($event->x, $event->y);
    return 0 unless defined $path; # didn't click on a row

    # Find row index and data based on the TreeView path
    my ($row_idx) = $path->get_indices;
    my $row_ref   = $sl->get_row_data_from_path ($path);
    warn "row index is $row_idx\n";
    warn "row_ref is of type " . ref($row_ref);
    warn "This row contains " . (join ", ", @$row_ref) . "\n";

    # when giving option to search for kanji, ignore the
    # currently-selected one
    my $kanji = $self->{kanji};
    warn "kanji is '$kanji'\n";

    # Will add options to search for other kanji in vocab
    my %other_kanji = ();
    my @selected_rows = $sl->get_selected_indices;
    @selected_rows = ($row_idx) if @selected_rows < 2;
    warn "Selected rows are: " . (join ", ", @selected_rows) . "\n";

    # Scan selected rows to pull out other kanji
    my $lol = $sl->{data};
    foreach my $i (@selected_rows) {
	my $vocab = strip_non_kanji($lol->[$i]->[COL_VOCAB]);
	foreach my $char (split "", $vocab) {
	    next if $char eq $kanji;
	    $other_kanji{$char} = undef;
	}
    }
    #warn join ", ", keys %other_kanji;

    my $menu = Gtk2::Menu->new();
    my $menu_item;
    my $menu_items = 0;

    for my $char (sort { $a cmp $b } keys %other_kanji) {
	$menu_item = Gtk2::MenuItem->new("Look up $char");
	$menu_item->signal_connect(
	    activate => sub {
		$self->jump_to_kanji($char);
	    }
	);
	$menu_items++;
	$menu_item->show;
	$menu->append($menu_item);
    }
    
    # Add menu item for copying either vocab or reading
    if (@selected_rows == 1) {
	if ($menu_items) {
	    $menu_item = Gtk2::SeparatorMenuItem->new;
	    $menu_item->show;
	    $menu->append($menu_item);
	}	    
	for my $col (2,3) {
	    my $copy_text = $row_ref->[$col];
	    $menu_item = Gtk2::MenuItem->new("Copy $copy_text");
	    $menu_item->signal_connect(
		activate => sub {
		    Gtk2::Clipboard->get(Gtk2::Gdk->SELECTION_CLIPBOARD)
			->set_text($copy_text);
		}
	    );
	    $menu_item->show;
	    $menu->append($menu_item);
	}
    }

    # Add menu item for setting exemplary vocab
    if (@selected_rows == 1) {
	$menu_item = Gtk2::SeparatorMenuItem->new;
	$menu_item->show;
	$menu->append($menu_item);
	# need vocab_id for this to work; it must be a non-displayed
	# field in the row_ref above.
	my $vocab_id = $row_ref->[COL_VOCAB_ID];
	my $vocrec = KanjiReadings::Vocabulary->retrieve($vocab_id);
	$menu_item = Gtk2::MenuItem->new("Exemplar " . $vocrec->vocab_ja);
	$menu_item->signal_connect(
	    activate => sub {
		# I should really use a popup if there's already an
		# exemplary vocab id set.
		warn "would set exemplar for $panel kanji $kanji to vocab id $vocab_id";
		# Looks like we also have to pull out yomi_id ... more hidden fields :(
	    }
	);
	$menu_item->show;
	$menu->append($menu_item);
    }


    $menu->popup(undef,undef,undef,undef,$event->button, $event->time);
    
    return 1;			# indicates we consumed the event
}

sub build_matched {
    my $self = shift;
    Gtk2::Ex::FormFactory::Form->new(
#	height  => 400,
	expand  => 1,
	content => [
	    Gtk2::Ex::FormFactory::Label->new(
		label   => "Vocab with matching readings",
	    ),
	    $self->{ff_matched} =
	    Gtk2::Ex::FormFactory::List->new(
		attr    => "kanji.matched",
		columns => ["JLPT", "Vocab_id", "Vocab", "Reading", "Type", "Kana"],
		visible => [1,0,1,1,1,1],
		height  => 400,
		scrollbars => ["never", "automatic"],
		expand => 1,
		selection_mode => "multiple",
		signal_connect => {
		    button_press_event => sub {
			my ($sl,$event) = @_;
			return ($event->button == 3);
		    },
		    button_release_event => sub {
			$self->vocab_panel_popup_menu(@_, "matched");
		    }
		},		
	    )
	]
    )
}

sub build_failed {
    my $self = shift;
    Gtk2::Ex::FormFactory::Form->new(
#	height  => 200,
	expand  => 1,
	content => [
	    Gtk2::Ex::FormFactory::Label->new(
		label   => "Unmatched Vocab",
	    ),
	    Gtk2::Ex::FormFactory::List->new(
		attr    => "kanji.failed",
		columns => ["JLPT", "Vocab_id", "Vocab", "Reading"],
		visible => [1,0,1,1],
		height  => 140,
		scrollbars => ["never", "automatic"],
		expand => 1,
		selection_mode => "multiple",
		signal_connect => {
		    button_press_event => sub {
			my ($sl,$event) = @_;
			return ($event->button == 3);
		    },
		    button_release_event => sub {
			$self->vocab_panel_popup_menu(@_, "failed");
		    }
		},		
	    )
	]
    )
}

1;
